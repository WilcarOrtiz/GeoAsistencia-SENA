import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
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
    summary: 'Crear un nuevo semestre',
    description: 'Crea un nuevo semestre en el sistema.',
  })
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un semestre',
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
    summary: 'obtener un semestre',
    description:
      'Obtiene un semestre en base a un termino de busqueda (code, id).',
  })
  findOne(@Param('term') term: string) {
    return this.semesterService.findOne(term);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
    description:
      'Lista la informacion de los semestres registrados en el sistema.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.semesterService.findAll(paginationDto);
  }
}
