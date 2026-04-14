import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ClassGroupsService } from './class-groups.service';
import { CreateClassGroupDto } from './dto/create-class-group.dto';
import { PublicAccess } from 'src/common/decorators';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { FindAllClaasGroupsDto } from './dto/find-all-classgroup.dto';
import {
  ClassGroupResponseDto,
  PaginatedClassGroupResponseDto,
} from './dto/class-group-response.dto';
import { plainToInstance } from 'class-transformer';

@PublicAccess()
@Controller('class-groups')
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear grupo de clase',
  })
  @ApiOkResponse({ type: ClassGroupResponseDto })
  async create(@Body() createClassGroupDto: CreateClassGroupDto) {
    const result = await this.classGroupsService.create(createClassGroupDto);
    return plainToInstance(ClassGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Listar grupos de clase',
    description: 'Obtiene los grupos de clase con paginación',
  })
  @ApiOkResponse({ type: PaginatedClassGroupResponseDto })
  async findAll(@Query() query: FindAllClaasGroupsDto) {
    const result = await this.classGroupsService.findAll(query);

    return {
      ...result,
      data: plainToInstance(ClassGroupResponseDto, result.data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
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
