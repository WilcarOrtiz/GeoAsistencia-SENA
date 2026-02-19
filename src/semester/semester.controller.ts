import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { SemesterService } from './semester.service';

import { PublicAccess } from 'src/common/decorators';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import {
  ChangeSemesterStateDto,
  CreateSemesterDto,
  UpdateSemesterDto,
} from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@PublicAccess()
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear semestre',
  })
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar semestre',
    description:
      'Actualizar la informacion base de un semestre un nuevo semestre en el sistema.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Cambiar estado del semestre' })
  @ApiBody({
    type: ChangeSemesterStateDto,
    description: 'Nuevo estado que se asignará al semestre',
  })
  changeState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeSemesterStateDto,
  ) {
    return this.semesterService.changeState(id, dto.state);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener semestre',
    description:
      'Obtiene un semestre en base a un termino de busqueda (code, id).',
  })
  findOne(@Param('term') term: string) {
    return this.semesterService.findOne(term);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.semesterService.findAll(paginationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar semestre',
    description: 'Elimina LOGICAMENTE el semestre del sistema',
  })
  remove(@Param('id') id: string) {
    return this.semesterService.remove(id);
  }
}
