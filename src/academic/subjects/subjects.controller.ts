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
import * as DTO from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginatedSubjectResponseDto } from './dto/subject-response.dto';
import { toDto, toPaginatedDto } from 'src/common/utils/dto-mapper.util';

@PublicAccess()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

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
