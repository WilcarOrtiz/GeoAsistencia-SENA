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
  Patch,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './service/enrollment.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { EnrollmentBulkService } from './service/enrollment-bulk.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import express from 'express';
import { toDto } from 'src/common/utils/dto-mapper.util';
import { RequiredPermissions } from 'src/common/decorators';
import * as dto from './dto/index';
import { PERMISSIONS } from 'src/common/constants/permisos';
import { PermissionsGuard } from 'src/common/guard';

@Controller('enrollment')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly enrollmentBulkService: EnrollmentBulkService,
  ) {}

  @Patch('remove')
  @RequiredPermissions(PERMISSIONS.RETIRAR_ESTUDIANTES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({ summary: 'Dar de baja a alumnos de un grupo de clase' })
  async cancellationStudent(@Body() dto: dto.removeEnrollmentDto) {
    return await this.enrollmentService.cancelEnrollments(
      dto.toGroupId,
      dto.students,
    );
  }

  @Post('move')
  @RequiredPermissions(PERMISSIONS.TRANSFERIR_ESTUDIANTES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({ summary: 'Mover alumnos de un grupo de clase a otro' })
  async mmoveStudent(@Body() dto: dto.MoveEnrollmentDto) {
    return await this.enrollmentService.moveStudents(
      dto.students,
      dto.fromGroupId,
      dto.toGroupId,
    );
  }

  @Get('bulk/template')
  @RequiredPermissions(PERMISSIONS.MATRICULAR_ESTUDIANTES)
  @UseGuards(PermissionsGuard)
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
  @RequiredPermissions(PERMISSIONS.MATRICULAR_ESTUDIANTES)
  @UseGuards(PermissionsGuard)
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

  @Get(':groupId')
  @RequiredPermissions(PERMISSIONS.VER_ESTUDIANTES_GRUPO)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Listar estudiantes matriculados en el grupo',
  })
  @ApiOkResponse({ type: [dto.EnrollmentResponseDto] })
  async findAll(
    @Param('groupId', ParseUUIDPipe) id: string,
  ): Promise<dto.EnrollmentResponseDto> {
    const result = await this.enrollmentService.getStudentsWithAttendance(id);
    return toDto(dto.EnrollmentResponseDto, result);
  }
}
