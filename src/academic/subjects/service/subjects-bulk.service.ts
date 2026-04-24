/* eslint-disable @typescript-eslint/no-base-to-string */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SubjectsService } from './subjects.service';
import { BulkImportResult, BulkSubjectRowDto } from '../dto';

const TEMPLATE_COLUMNS = [
  { header: 'Código (*)', key: 'code', width: 16 },
  { header: 'Nombre (*)', key: 'name', width: 32 },
] as const;

@Injectable()
export class SubjectsBulkService {
  private readonly logger = new Logger(SubjectsBulkService.name);

  constructor(private readonly subjectsService: SubjectsService) {}

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GeoAsistencia SENA';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Asignaturas', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = TEMPLATE_COLUMNS.map((col) => ({ ...col }));

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
      code: 'PRO234',
      name: 'Programacion II',
    });
    exampleRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' },
      };
      cell.font = { italic: true, color: { argb: 'FF888888' } };
    });

    const noteCell = sheet.getCell('D1');
    noteCell.value =
      '⚠ Los campos marcados con (*) son obligatorios. El código debe ser único (ej: PRO234, MAT101).';
    noteCell.font = { italic: true, size: 9, color: { argb: 'FF555555' } };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  async parseAndValidateExcel(fileBuffer: Buffer): Promise<{
    rows: BulkSubjectRowDto[];
    errors: { row: number; errors: string[] }[];
  }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) throw new BadRequestException('El archivo no contiene hojas');

    const rows: BulkSubjectRowDto[] = [];
    const errors: { row: number; errors: string[] }[] = [];

    const getSafeValue = (cell: ExcelJS.Cell): string => {
      if (!cell || cell.value === null || cell.value === undefined) return '';
      if (typeof cell.value === 'object' && 'result' in cell.value) {
        return String(cell.value.result ?? '').trim();
      }
      return String(cell.value).trim();
    };

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= 2) return;

      const plain = {
        code: getSafeValue(row.getCell(1)),
        name: getSafeValue(row.getCell(2)),
      };

      rows.push(plainToInstance(BulkSubjectRowDto, plain));
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

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'El archivo contiene errores de validación',
        errors,
      });
    }

    const result: BulkImportResult = { created: 0, failed: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await this.subjectsService.create({
          code: row.code,
          name: row.name,
        });
        result.created++;
      } catch (error: unknown) {
        this.logger.warn(`Fila ${i + 3} falló: ${(error as Error).message}`);
        result.failed.push({
          row: i + 3,
          code: row.code,
          errors: [(error as Error).message ?? 'Error desconocido'],
        });
      }
    }

    return result;
  }
}
