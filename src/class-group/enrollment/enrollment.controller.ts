import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { EnrollmentService } from './service/enrollment.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { MoveEnrollmentDto } from './dto/move-enrollment.dto';
import { EnrollmentBulkService } from './service/enrollment-bulk.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import express from 'express';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { toDto } from 'src/common/utils/dto-mapper.util';
import { PublicAccess } from 'src/common/decorators';

@Controller('enrollment')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly enrollmentBulkService: EnrollmentBulkService,
  ) {}

  @Post('move')
  @ApiOperation({ summary: 'Mover alumnos de grupo de clase a otro' })
  async moveStudent(@Body() dto: MoveEnrollmentDto) {
    return await this.enrollmentService.moveStudents(
      dto.students,
      dto.fromGroupId,
      dto.toGroupId,
    );
  }

  @Get('bulk/template')
  @ApiOperation({
    summary: 'Descargar plantilla Excel para matricular estudiantes',
  })
  async downloadTemplate(@Res() res: express.Response) {
    try {
      const buffer = await this.enrollmentBulkService.generateTemplate();

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="plantilla_matricula.xlsx"',
      });

      return res.send(buffer);
    } catch {
      throw new InternalServerErrorException('No se pudo generar la plantilla');
    }
  }

  @Post('bulk/import/:groupId')
  @ApiOperation({
    summary: 'Matricular estudiantes masivamente desde Excel',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        const allowed = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];

        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Solo archivos .xlsx o .xls'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async bulkEnroll(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return this.enrollmentBulkService.bulkEnrollment(groupId, file.buffer);
  }

  @PublicAccess()
  @Get(':groupId')
  @ApiOperation({
    summary: 'Listar estudiantes matriculados en el grupo',
  })
  @ApiOkResponse({ type: [EnrollmentResponseDto] })
  async findAll(
    @Param('groupId', ParseUUIDPipe) id: string,
  ): Promise<EnrollmentResponseDto> {
    const result = await this.enrollmentService.getStudentsWithAttendance(id);
    return toDto(EnrollmentResponseDto, result);
  }
}
