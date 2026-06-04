import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import * as DTORe from 'src/common/dtos/pagination.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { PermissionResponseDto } from './dto/permission-response.dto';
import { toPaginatedDto } from 'src/common/utils/dto-mapper.util';
import { PERMISSIONS } from 'src/common/constants/permisos';
import { PermissionsGuard } from 'src/common/guard';
import { RequiredPermissions } from 'src/common/decorators';

@Controller('permissions')
@RequiredPermissions(PERMISSIONS.MANAGE_ROLE)
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('matrix')
  @ApiOperation({
    summary: 'Listar permisos',
  })
  @ApiOkResponse({
    description: 'Lista los permisos para ser usado en la matrix de roles',
  })
  async findAllForMatrix(
    @Query() paginationDto: DTORe.PaginationDto,
  ): Promise<DTORe.PaginatedResponseDto<PermissionResponseDto>> {
    const result = await this.permissionsService.findAll({
      pagination: paginationDto,
      withRoles: true,
    });

    return toPaginatedDto(PermissionResponseDto, result);
  }
}
