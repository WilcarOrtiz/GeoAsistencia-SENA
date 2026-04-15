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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import * as DTO from './dto';
import { StateSemester } from 'src/common/enums/state_semester.enum';
import { PaginatedSemesterResponseDto } from './dto/semester-response.dto';
import { toDto, toPaginatedDto } from 'src/common/utils/dto-mapper.util';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar semestre academico',
  })
  @ApiOkResponse({ type: DTO.SemesterResponseDto })
  async create(
    @Body() dto: DTO.CreateSemesterDto,
  ): Promise<DTO.SemesterResponseDto> {
    return toDto(
      DTO.SemesterResponseDto,
      await this.semesterService.create(dto),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar semestre',
  })
  @ApiOkResponse({ type: DTO.SemesterResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.UpdateSemesterDto,
  ): Promise<DTO.SemesterResponseDto> {
    return toDto(
      DTO.SemesterResponseDto,
      await this.semesterService.update(id, dto),
    );
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Cambiar estado del semestre' })
  @ApiBody({
    type: DTO.ChangeSemesterStateDto,
    description: 'Nuevo estado que se asignará al semestre',
  })
  @ApiOkResponse({
    schema: {
      example: { state: StateSemester.ACTIVE },
    },
  })
  async changeState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.ChangeSemesterStateDto,
  ) {
    return await this.semesterService.changeState(id, dto.state);
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Listar semestres ',
    description: `
    Obtiene informacion basica de los semestres, segun tipo:  
    * **select:** Inclusión opcional de usuarios inactivos.
    * **filter:** Filtro por rol.
    * * `,
  })
  async findAllForSelect(
    @Query('type') type: 'select' | 'filter' = 'select',
  ): Promise<{ id: string; name: string; code: string }[]> {
    return await this.semesterService.findAllForSelect(type);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener un semestre',
    description:
      'Obtiene un semestre en base a un termino de busqueda (code, id).',
  })
  @ApiOkResponse({ type: DTO.SemesterResponseDto })
  async findOne(@Param('term') term: string): Promise<DTO.SemesterResponseDto> {
    return toDto(
      DTO.SemesterResponseDto,
      await this.semesterService.findOne(term),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
  })
  @ApiOkResponse({ type: PaginatedSemesterResponseDto })
  async findAll(
    @Query() dto: DTO.FindAllSemesterDto,
  ): Promise<PaginatedSemesterResponseDto> {
    return toPaginatedDto(
      DTO.SemesterResponseDto,
      await this.semesterService.findAll(dto),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar semestre (logicamente)',
  })
  @ApiOkResponse({ type: DTO.SemesterResponseDto })
  async remove(@Param('id') id: string) {
    return await this.semesterService.remove(id);
  }
}
