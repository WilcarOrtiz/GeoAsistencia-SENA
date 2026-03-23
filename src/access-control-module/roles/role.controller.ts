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
import { RoleResponseDto } from './dto/roles-response.dto';

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
