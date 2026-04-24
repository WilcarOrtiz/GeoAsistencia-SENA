/* eslint-disable @typescript-eslint/no-base-to-string */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EnrollmentService } from './enrollment.service';
import { BulkEnrollmentRowDto } from '../dto/bulk-create-user.dto';

const TEMPLATE_COLUMNS = [
  { header: 'ID ESTUDIANTE (*)', key: 'ID', width: 25 },
] as const;

export interface BulkEnrollmentResult {
  enrolled: number;
  failed: { row: number; ID?: string; errors: string[] }[];
}

@Injectable()
export class EnrollmentBulkService {
  private readonly logger = new Logger(EnrollmentBulkService.name);

  constructor(private readonly enrollmentService: EnrollmentService) {}

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet('Matriculas', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = TEMPLATE_COLUMNS.map((c) => ({ ...c }));

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF39A900' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    headerRow.height = 22;

    sheet.addRow({ ID: '1066865142' });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  async parseAndValidate(fileBuffer: Buffer): Promise<{
    rows: BulkEnrollmentRowDto[];
    errors: { row: number; errors: string[] }[];
  }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) throw new BadRequestException('El archivo no contiene hojas');

    const rows: BulkEnrollmentRowDto[] = [];
    const errors: { row: number; errors: string[] }[] = [];

    const getSafeValue = (cell: ExcelJS.Cell): string =>
      cell?.value ? String(cell.value).trim() : '';

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= 1) return;

      const plain = {
        ID: getSafeValue(row.getCell(1)),
      };

      rows.push(plainToInstance(BulkEnrollmentRowDto, plain));
    });

    for (let i = 0; i < rows.length; i++) {
      const validationErrors = await validate(rows[i]);

      if (validationErrors.length > 0) {
        errors.push({
          row: i + 2,
          errors: validationErrors.flatMap((e) =>
            Object.values(e.constraints ?? {}),
          ),
        });
      }
    }

    return { rows, errors };
  }

  async bulkEnrollment(
    groupId: string,
    fileBuffer: Buffer,
  ): Promise<BulkEnrollmentResult> {
    const { rows, errors } = await this.parseAndValidate(fileBuffer);

    const result: BulkEnrollmentResult = {
      enrolled: 0,
      failed: [...errors],
    };

    const validRows = rows.filter(
      (_, i) => !errors.some((e) => e.row === i + 2),
    );

    const resolvedIds: string[] = [];

    for (let i = 0; i < validRows.length; i++) {
      try {
        const uuid = await this.enrollmentService.findStudentUuidByIdUser(
          validRows[i].ID,
        );
        resolvedIds.push(uuid);
      } catch {
        result.failed.push({
          row: i + 2,
          ID: validRows[i].ID,
          errors: [`No se encontró estudiante con ID: ${validRows[i].ID}`],
        });
      }
    }

    if (resolvedIds.length === 0) return result;

    try {
      const res = await this.enrollmentService.enrollStudents(
        groupId,
        resolvedIds,
      );
      result.enrolled = resolvedIds.length;
      this.logger.log(res.message);
    } catch (error: any) {
      result.failed.push({ row: 0, errors: [(error as Error).message] });
    }

    return result;
  }
}
