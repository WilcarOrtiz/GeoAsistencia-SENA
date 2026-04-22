/* eslint-disable @typescript-eslint/no-base-to-string */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { ROLE_SYSTEM_KEYS } from 'src/common/enums/valid-role.enum';
import * as ExcelJS from 'exceljs';
import { BulkUserRowDto } from '../dto/bulk-create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const TEMPLATE_COLUMNS = [
  { header: 'ID (*)', key: 'ID', width: 16 },
  { header: 'Primer nombre (*)', key: 'first_name', width: 18 },
  { header: 'Segundo nombre', key: 'middle_name', width: 18 },
  { header: 'Primer apellido (*)', key: 'last_name', width: 18 },
  { header: 'Segundo apellido', key: 'second_last_name', width: 18 },
  { header: 'Correo (*)', key: 'email', width: 28 },
  {
    header: `Rol (*) — opciones: ${ROLE_SYSTEM_KEYS.join(' | ')}`,
    key: 'roles',
    width: 36,
  },
] as const;

export interface BulkImportResult {
  created: number;
  failed: { row: number; ID?: string; errors: string[] }[];
}

@Injectable()
export class UserBulkService {
  private readonly logger = new Logger(UserBulkService.name);

  constructor(private readonly userService: UserService) {}

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GeoAsistencia SENA';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Usuarios', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = TEMPLATE_COLUMNS.map((col) => ({ ...col }));
    sheet.getColumn(6).numFmt = '@';

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF39A900' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
    headerRow.height = 22;

    const exampleRow = sheet.addRow({
      ID: '1066865142',
      first_name: 'Wilcar',
      middle_name: 'Daniel',
      last_name: 'Ortiz',
      second_last_name: 'Colpas',
      email: 'wilcar@sena.edu.co',
      roles: 'TEACHER',
    });
    exampleRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' },
      };
      cell.font = { italic: true, color: { argb: 'FF888888' } };
    });

    const noteCell = sheet.getCell('I1');
    noteCell.value =
      '⚠ Los campos marcados con (*) son obligatorios. ' +
      'Para múltiples roles separa con coma: TEACHER,STUDENT';
    noteCell.font = { italic: true, size: 9, color: { argb: 'FF555555' } };

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  async parseAndValidateExcel(fileBuffer: Buffer): Promise<{
    rows: BulkUserRowDto[];
    errors: { row: number; errors: string[] }[];
  }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) throw new BadRequestException('El archivo no contiene hojas');

    const rows: BulkUserRowDto[] = [];
    const errors: { row: number; errors: string[] }[] = [];

    const getSafeValue = (cell: ExcelJS.Cell): string => {
      if (!cell || cell.value === null || cell.value === undefined) return '';

      if (typeof cell.value === 'object' && 'text' in cell.value) {
        return String((cell.value as { text: unknown }).text ?? '').trim();
      }

      if (typeof cell.value === 'object' && 'result' in cell.value) {
        return String((cell.value as { result: unknown }).result ?? '').trim();
      }

      return String(cell.value).trim();
    };
    const cleanEmail = (raw: string): string =>
      raw
        .replace(/\u00A0/g, '')
        .replace(/\r|\n|\t/g, '')
        .trim()
        .toLowerCase();

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= 2) return;

      const rawRoles = getSafeValue(row.getCell(7))
        .split(',')
        .map((r) => r.trim().toUpperCase())
        .filter(Boolean);

      const rawCell = getSafeValue(row.getCell(6));
      this.logger.debug(`Fila ${rowNumber} email raw: "${rawCell}"`);
      this.logger.debug(
        `Char codes: ${[...rawCell].map((c) => c.charCodeAt(0)).join(',')}`,
      );
      const plain = {
        ID: getSafeValue(row.getCell(1)),
        first_name: getSafeValue(row.getCell(2)),
        middle_name: getSafeValue(row.getCell(3)) || undefined,
        last_name: getSafeValue(row.getCell(4)),
        second_last_name: getSafeValue(row.getCell(5)) || undefined,
        email: cleanEmail(getSafeValue(row.getCell(6))),
        roles: rawRoles,
      };

      rows.push(plainToInstance(BulkUserRowDto, plain));
    });

    for (let i = 0; i < rows.length; i++) {
      const validationErrors = await validate(rows[i]);
      if (validationErrors.length > 0) {
        errors.push({
          row: i + 3,
          errors: validationErrors.flatMap((e) =>
            Object.values(e.constraints ?? {}),
          ),
        });
      }
    }

    return { rows, errors };
  }

  async bulkImport(fileBuffer: Buffer): Promise<BulkImportResult> {
    const { rows, errors } = await this.parseAndValidateExcel(fileBuffer);

    const result: BulkImportResult = {
      created: 0,
      failed: [...errors],
    };

    const invalidRows = new Set(errors.map((e) => e.row));

    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 3;
      if (invalidRows.has(rowNumber)) continue;

      const row = rows[i];
      try {
        const rolesID = await this.userService.resolveRoleNameToIds(row.roles);
        await this.userService.createUser({
          ID: row.ID,
          first_name: row.first_name,
          middle_name: row.middle_name,
          last_name: row.last_name,
          second_last_name: row.second_last_name,
          email: row.email,
          rolesID,
        });
        result.created++;
      } catch (error: unknown) {
        const message = (error as Error).message ?? 'Error desconocido';
        this.logger.warn(`Fila ${rowNumber} falló: ${message}`);
        result.failed.push({
          row: rowNumber,
          ID: row.ID,
          errors: [message],
        });
      }
    }

    return result;
  }
}
