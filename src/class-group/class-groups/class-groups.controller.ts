import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClassGroupsService } from './class-groups.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { toDto, toPaginatedDto } from 'src/common/utils/dto-mapper.util';
import * as DTO from './dto';

@Controller('class-groups')
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar grupo de clase',
  })
  @ApiOkResponse({ type: DTO.ClassGroupResponseDto })
  async create(@Body() dto: DTO.CreateClassGroupDto) {
    return toDto(
      DTO.ClassGroupResponseDto,
      await this.classGroupsService.create(dto),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar grupos de clase',
    description: 'Obtiene los grupos de clase con paginación',
  })
  @ApiOkResponse({ type: DTO.PaginatedClassGroupResponseDto })
  async findAll(@Query() query: DTO.FindAllClaasGroupsDto) {
    const result = await this.classGroupsService.findAll(query);
    return toPaginatedDto(DTO.ClassGroupResponseDto, result);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar Grupo de clase',
    description:
      'Actualiza los datos base del grupo de clase, con algunas excepciones de datos criticos.',
  })
  @ApiOkResponse({ type: DTO.UpdateClassGroupDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.UpdateClassGroupDto,
  ) {
    return toDto(
      DTO.UpdateClassGroupDto,
      await this.classGroupsService.update(id, dto),
    );
  }
  @Get(':id/transfer-options')
  async findTransferOptions(@Param('id', ParseUUIDPipe) id: string) {
    return toDto(
      DTO.ClassGroupOption,
      await this.classGroupsService.findTransferOptions(id),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un grupo de clase',
    description: 'Obtiene el detalle de un grupo de clase por id',
  })
  @ApiOkResponse({ type: DTO.ClassGroupResponseDto })
  async findOne(@Param('id') id: string) {
    return toDto(
      DTO.ClassGroupResponseDto,
      await this.classGroupsService.findOne(id),
    );
  }
}
