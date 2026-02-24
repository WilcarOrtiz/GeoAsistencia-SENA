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
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PublicAccess } from 'src/common/decorators';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  @Patch('sync-permissions')
  @ApiOperation({
    summary: 'Sincronización de permisos de un rol',
    description:
      'Actualiza completamente los permisos asociados a un rol específico.',
  })
  @ApiOkResponse({})
  async syncPermissions(@Body() dto: UpdateRolePermissions) {
    return await this.roleService.syncPermissions(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'obtener un rol con sus sus permisos',
  })
  @ApiOkResponse({})
  @ApiNotFoundResponse({ description: 'Rol no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const [role] = await this.roleService.find({
      ids: [id],
      withPermissions: true,
    });
    return role;
  }
}
