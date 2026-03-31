import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { PublicAccess } from 'src/common/decorators';
import { plainToInstance } from 'class-transformer';
import { CreateSubjectDto, SubjectResponseDto, UpdateSubjectDto } from './dto';

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

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar asignatura',
    description: 'Elimina LOGICAMENTE la asignatura del sistema',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.remove(id);
  }
}
