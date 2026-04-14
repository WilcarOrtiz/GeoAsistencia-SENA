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
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { PublicAccess } from 'src/common/decorators';
import { plainToInstance } from 'class-transformer';
import { CreateSubjectDto, SubjectResponseDto, UpdateSubjectDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginatedSubjectResponseDto } from './dto/subject-response.dto';

@PublicAccess()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear asignatura',
  })
  @ApiOkResponse({ type: SubjectResponseDto })
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectsService.create(createSubjectDto);
    return plainToInstance(SubjectResponseDto, subject, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Listar asignaturas para select',
    description:
      'Obtiene las asignaturas activas para uso en selects (creación de grupos)',
  })
  async findAllForSelect() {
    return await this.subjectsService.findAllForSelect();
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener asignatura',
    description:
      'Obtiene una asignatura en base a un termino de busqueda (code, id, name).',
  })
  @ApiOkResponse({ type: SubjectResponseDto })
  findOne(@Param('term') term: string) {
    return this.subjectsService.findOne(term);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar asigantura',
  })
  @ApiOkResponse({ type: SubjectResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
  })
  @ApiOkResponse({ type: PaginatedSubjectResponseDto })
  async FindAllSemesterDto(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedSubjectResponseDto> {
    const result = await this.subjectsService.findAll(pagination);

    return {
      ...result,
      data: plainToInstance(SubjectResponseDto, result.data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar asignatura',
    description: 'Elimina LOGICAMENTE la asignatura del sistema',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.remove(id);
  }
}
