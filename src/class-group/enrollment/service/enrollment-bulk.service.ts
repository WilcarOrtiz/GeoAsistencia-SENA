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

    const studentIds = rows.map((r) => r.ID);

    try {
      const res = await this.enrollmentService.enrollStudents(
        groupId,
        studentIds,
      );
      result.enrolled = studentIds.length - errors.length;
      this.logger.log(res.message);
    } catch (error: any) {
      const message = (error as Error).message ?? 'Error desconocido';
      this.logger.error(message);
      result.failed.push({
        row: 0,
        errors: [message],
      });
    }

    return result;
  }
}
