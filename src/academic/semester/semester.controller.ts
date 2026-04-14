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

import {
  ChangeSemesterStateDto,
  CreateSemesterDto,
  FindAllSemesterDto,
  SemesterResponseDto,
  UpdateSemesterDto,
} from './dto';
import { plainToInstance } from 'class-transformer';
import { StateSemester } from 'src/common/enums/state_semester.enum';
import { PaginatedSemesterResponseDto } from './dto/semester-response.dto';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear semestre',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  async create(
    @Body() createSemesterDto: CreateSemesterDto,
  ): Promise<SemesterResponseDto> {
    const semester = await this.semesterService.create(createSemesterDto);
    return plainToInstance(SemesterResponseDto, semester, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar semestre',
    description:
      'Actualizar la informacion base de un semestre un nuevo semestre en el sistema.',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ): Promise<SemesterResponseDto> {
    const semester = await this.semesterService.update(id, updateSemesterDto);
    return plainToInstance(SemesterResponseDto, semester, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Cambiar estado del semestre' })
  @ApiBody({
    type: ChangeSemesterStateDto,
    description: 'Nuevo estado que se asignará al semestre',
  })
  @ApiOkResponse({
    schema: {
      example: { state: StateSemester.ACTIVE },
    },
  })
  async changeState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeSemesterStateDto,
  ) {
    return await this.semesterService.changeState(id, dto.state);
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Listar semestres para select',
    description:
      'Obtiene los semestres activos o planeados para uso en selects (creación de grupos) tenemos type o filter',
  })
  async findAllForSelect(@Query('type') type: 'select' | 'filter' = 'select') {
    return await this.semesterService.findAllForSelect(type);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'obtener semestre',
    description:
      'Obtiene un semestre en base a un termino de busqueda (code, id).',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  async findOne(@Param('term') term: string): Promise<SemesterResponseDto> {
    const semester = await this.semesterService.findOne(term);

    return plainToInstance(SemesterResponseDto, semester, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Listar semestres',
  })
  @ApiOkResponse({ type: PaginatedSemesterResponseDto })
  async findAll(
    @Query() findAllSemesterDto: FindAllSemesterDto,
  ): Promise<PaginatedSemesterResponseDto> {
    const result = await this.semesterService.findAll(findAllSemesterDto);

    return {
      ...result,
      data: plainToInstance(SemesterResponseDto, result.data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar semestre',
    description: 'Elimina LOGICAMENTE el semestre del sistema',
  })
  @ApiOkResponse({ type: SemesterResponseDto })
  async remove(@Param('id') id: string) {
    return await this.semesterService.remove(id);
  }
}
