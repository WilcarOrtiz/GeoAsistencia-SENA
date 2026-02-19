import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PublicAccess } from 'src/common/decorators';

@PublicAccess()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear asignatura',
  })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar asignaturas',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.subjectsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener asignatura',
    description:
      'Obtiene una asignatura en base a un termino de busqueda (code, id, name).',
  })
  findOne(@Param('term') term: string) {
    return this.subjectsService.findOne(term);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar asigantura',
  })
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar asignatura',
    description: 'Elimina LOGICAMENTE la asignatura del sistema',
  })
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}
