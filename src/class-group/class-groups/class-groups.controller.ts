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
import type { ICurrentUser } from 'src/common/interface/current-user.interface';
import { GetUser } from 'src/common/decorators';

@Controller('class-groups')
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar grupo de clase',
  })
  @ApiOkResponse({ type: DTO.ClassGroupResponseDto })
  async create(
    @Body() dto: DTO.CreateClassGroupDto,
  ): Promise<DTO.ClassGroupResponseDto> {
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
  async findAll(
    @Query() query: DTO.FindAllClaasGroupsDto,
    @GetUser() user: ICurrentUser,
  ): Promise<DTO.PaginatedClassGroupResponseDto> {
    const result = await this.classGroupsService.findAll(query, user);
    return toPaginatedDto(DTO.ClassGroupResponseDto, result);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar Grupo de clase',
    description:
      'Actualiza los datos basicos del grupo de clases (NO HORARIOS).',
  })
  @ApiOkResponse({ type: DTO.UpdateClassGroupDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.UpdateClassGroupDto,
  ): Promise<DTO.UpdateClassGroupDto> {
    return toDto(
      DTO.UpdateClassGroupDto,
      await this.classGroupsService.update(id, dto),
    );
  }

  @Get(':id/transfer-options')
  @ApiOperation({
    summary: 'Grupos para transferencia',
    description:
      'Permite obtener una lista con la minimia informacion de los grupos a los cuales se puede transferir un estudiante de un grupo especifico ',
  })
  @ApiOkResponse({ type: DTO.ClassGroupOption })
  async findTransferOptions(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DTO.ClassGroupOption> {
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
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DTO.ClassGroupResponseDto> {
    return toDto(
      DTO.ClassGroupResponseDto,
      await this.classGroupsService.findOne(id),
    );
  }
}
