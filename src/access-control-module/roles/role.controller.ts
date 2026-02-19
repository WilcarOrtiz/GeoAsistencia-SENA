import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  @Patch('sync-permissions')
  @ApiOperation({
    summary: 'Sincronización de permisos de un rol',
    description:
      'Actualiza completamente los permisos asociados a un rol específico.',
  })
  async syncPermissions(@Body() dto: UpdateRolePermissions) {
    return await this.roleService.syncPermissions(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'obtener un rol con sus sus permisos',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const roles = await this.roleService.find({
      ids: [id],
      withPermissions: true,
    });
    return roles[0];
  }
}
