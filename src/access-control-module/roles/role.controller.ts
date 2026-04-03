import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { RolesService } from './roles.service';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';
import { PublicAccess } from 'src/common/decorators';
import {
  RoleResponseDto,
  RoleSimpleResponseDto,
} from './dto/roles-response.dto';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  @Patch('sync-permissions')
  @ApiOperation({
    summary: 'Sincronización de permisos de un rol',
    description: 'Actualiza los permisos de un rol.',
  })
  @ApiOkResponse({ type: RoleResponseDto })
  async syncPermissions(
    @Body() dto: UpdateRolePermissions,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.syncPermissions(dto);

    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':roleId/permissions/:permissionId/remove')
  @ApiOperation({
    summary: 'Quitar un permiso de un rol',
  })
  @ApiOkResponse({
    description: 'Permiso removido correctamente',
  })
  async removePermissionFromRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ): Promise<{ message: string }> {
    await this.roleService.removePermissionFromRole(roleId, permissionId);

    return {
      message: 'Permiso removido correctamente',
    };
  }

  @Patch(':roleId/permissions/:permissionId/add')
  @ApiOperation({
    summary: 'Agregar un permiso a un rol',
  })
  @ApiOkResponse({
    description: 'Permiso agregado correctamente',
  })
  async addPermissionToRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ): Promise<{ message: string }> {
    await this.roleService.addPermissionToRole(roleId, permissionId);

    return {
      message: 'Permiso agregado correctamente',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'obtener roles del sistema',
  })
  @ApiOkResponse({ type: RoleSimpleResponseDto })
  async findAll() {
    const result = await this.roleService.findAll();

    return result;
  }

  //TODO: borrar si no lo utilizo
  @Get(':id')
  @ApiOperation({
    summary: 'obtener rol junto a sus permisos',
  })
  @ApiOkResponse({ type: RoleResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.findOneById(id, undefined, true);

    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }
}
