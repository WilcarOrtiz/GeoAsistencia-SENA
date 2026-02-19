import { Controller, Get, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('matrix')
  @ApiOperation({
    summary: 'Listado de permisos para matriz de roles',
    description:
      'Obtiene un listado paginado de permisos, incluyendo sus roles asociados, para ser utilizados en una vista tipo matriz (roles vs permisos).',
  })
  findAllForMatrix(@Query() paginationDto: PaginationDto) {
    return this.permissionsService.find({
      pagination: paginationDto,
      withRoles: true,
    });
  }
}
