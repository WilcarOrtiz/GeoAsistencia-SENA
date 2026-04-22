/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import * as DTO from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginatedSubjectResponseDto } from './dto/subject-response.dto';
import { toDto, toPaginatedDto } from 'src/common/utils/dto-mapper.util';
import { SubjectsBulkService } from './subjects-bulk.service';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import express from 'express';
import { PublicAccess } from 'src/common/decorators';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly subjectsBulkService: SubjectsBulkService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar asignatura',
  })
  @ApiOkResponse({ type: DTO.SubjectResponseDto })
  async create(@Body() dto: DTO.CreateSubjectDto) {
    return toDto(
      DTO.SubjectResponseDto,
      await this.subjectsService.create(dto),
    );
  }

  @PublicAccess()
  @Get('bulk/template')
  @ApiOperation({
    summary: 'Descargar plantilla Excel para carga masiva de asignaturas',
  })
  async downloadTemplate(@Res() res: express.Response) {
    try {
      const buffer = await this.subjectsBulkService.generateTemplate();
      const fileName = 'plantilla_asignaturas.xlsx';
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length,
      });
      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el archivo',
        error,
      });
    }
  }

  @PublicAccess()
  @Post('bulk/import')
  @ApiOperation({
    summary: 'Importar asignaturas masivamente desde un archivo Excel',
    description:
      'Recibe un archivo .xlsx con la misma estructura de la plantilla, ' +
      'valida cada fila y crea las asignaturas. ' +
      'Devuelve cuántas se crearon y cuáles fallaron con el motivo.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        created: 5,
        failed: [
          { row: 4, code: 'PRO234', errors: ['El código ya está en uso'] },
        ],
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
            new BadRequestException('Solo se permiten archivos .xlsx o .xls'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async bulkImport(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return this.subjectsBulkService.bulkImport(file.buffer);
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Listar asignaturas (select)',
  })
  async findAllForSelect(): Promise<
    { id: string; name: string; code: string }[]
  > {
    return await this.subjectsService.findAllForSelect();
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener asignatura',
    description:
      'Obtiene una asignatura en base a un termino de busqueda (code, id, name).',
  })
  @ApiOkResponse({ type: DTO.SubjectResponseDto })
  async findOne(@Param('term') term: string) {
    return toDto(
      DTO.SubjectResponseDto,
      await this.subjectsService.findOne(term),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar asigantura',
  })
  @ApiOkResponse({ type: DTO.SubjectResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.UpdateSubjectDto,
  ) {
    return toDto(
      DTO.SubjectResponseDto,
      await this.subjectsService.update(id, dto),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar asignaturas',
  })
  @ApiOkResponse({ type: PaginatedSubjectResponseDto })
  async FindAllSemesterDto(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedSubjectResponseDto> {
    return toPaginatedDto(
      DTO.SubjectResponseDto,
      await this.subjectsService.findAll(pagination),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar asignatura (Logicamente)',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.remove(id);
  }
}
