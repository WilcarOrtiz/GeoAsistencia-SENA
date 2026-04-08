import { Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { RolesService } from './roles.service';
import { PublicAccess } from 'src/common/decorators';
import { RoleResponseDto } from './dto/roles-response.dto';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  //TODO: USADO
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

  //TODO: USADO
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

  //TODO: USADO
  @Get()
  @ApiOperation({
    summary: 'Listar roles del sistema',
  })
  @ApiOkResponse({ type: RoleResponseDto })
  async findAll() {
    const result = await this.roleService.findAll();

    return plainToInstance(RoleResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}

// Borrados: obtener rol junto a sus permisos - Sincronización de permisos de un rol
