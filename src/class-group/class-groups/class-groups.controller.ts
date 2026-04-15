import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ClassGroupsService } from './class-groups.service';
import { CreateClassGroupDto } from './dto/create-class-group.dto';
import { PublicAccess } from 'src/common/decorators';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { FindAllClaasGroupsDto } from './dto/find-all-classgroup.dto';
import * as DTO from './dto/class-group-response.dto';

import { toDto, toPaginatedDto } from 'src/common/utils/dto-mapper.util';

@PublicAccess()
@Controller('class-groups')
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar grupo de clase',
  })
  @ApiOkResponse({ type: DTO.ClassGroupResponseDto })
  async create(@Body() dto: CreateClassGroupDto) {
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
  async findAll(@Query() query: FindAllClaasGroupsDto) {
    const result = await this.classGroupsService.findAll(query);
    return toPaginatedDto(DTO.ClassGroupResponseDto, result);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un grupo de clase',
    description: 'Obtiene el detalle de un grupo de clase por id',
  })
  async findOne(@Param('id') id: string) {
    return await this.classGroupsService.findOne(id);
  }
}
