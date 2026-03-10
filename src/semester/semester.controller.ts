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
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import {
  ChangeSemesterStateDto,
  CreateSemesterDto,
  SemesterResponseDto,
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
  @ApiOkResponse({ type: SemesterResponseDto })
  create(
    @Body() createSemesterDto: CreateSemesterDto,
  ): Promise<SemesterResponseDto> {
    return this.semesterService.create(createSemesterDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar semestre',
    description:
      'Actualizar la informacion base de un semestre un nuevo semestre en el sistema.',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ): Promise<SemesterResponseDto> {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Cambiar estado del semestre' })
  @ApiBody({
    type: ChangeSemesterStateDto,
    description: 'Nuevo estado que se asignará al semestre',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  changeState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeSemesterStateDto,
  ): Promise<SemesterResponseDto> {
    return this.semesterService.changeState(id, dto.state);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener semestre',
    description:
      'Obtiene un semestre en base a un termino de busqueda (code, id).',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  findOne(@Param('term') term: string): Promise<SemesterResponseDto> {
    return this.semesterService.findOne(term);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
  })
  @ApiOkResponse({ type: [SemesterResponseDto] })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SemesterResponseDto[]> {
    return this.semesterService.findAll(paginationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar semestre',
    description: 'Elimina LOGICAMENTE el semestre del sistema',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  remove(@Param('id') id: string): Promise<SemesterResponseDto> {
    return this.semesterService.remove(id);
  }
}
