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
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import * as DTO from './dto';
import { toDto, toPaginatedDto } from 'src/common/utils/dto-mapper.util';

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

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
  })
  @ApiOkResponse({ type: DTO.PaginatedSemesterResponseDto })
  async findAll(
    @Query() dto: DTO.FindAllSemesterDto,
  ): Promise<DTO.PaginatedSemesterResponseDto> {
    return toPaginatedDto(
      DTO.SemesterResponseDto,
      await this.semesterService.findAll(dto),
    );
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Listar semestres ',
    description: `
    Obtiene informacion basica de los semestres, segun tipo:  
    * **select:** retorna solo semestres activos o planeados.
    * **filter:** retorna semestres segun filtros.
    * * `,
  })
  @ApiOkResponse({ type: DTO.SemesterSelectDto })
  async findAllForSelect(
    @Query('type') type: 'select' | 'filter' = 'select',
  ): Promise<DTO.SemesterSelectDto> {
    const data = await this.semesterService.findAllForSelect(type);
    return toDto(DTO.SemesterSelectDto, data);
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
  @ApiOkResponse({ type: DTO.ChangeSemesterStateResponseDto })
  async changeState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.ChangeSemesterStateDto,
  ) {
    return toDto(
      DTO.ChangeSemesterStateResponseDto,
      await this.semesterService.changeState(id, dto.state),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar semestre (logicamente)',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Semestre eliminado correctamente',
      },
    },
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return await this.semesterService.remove(id);
  }
}
