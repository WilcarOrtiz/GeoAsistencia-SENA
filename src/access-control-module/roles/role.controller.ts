import { Body, Controller, Patch } from '@nestjs/common';
import { RolesService } from './roles.service';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  @Patch('add-permissions')
  addPermissions(@Body() dto: UpdateRolePermissions) {
    return this.roleService.addPermissions(dto);
  }

  @Patch('remove-permissions')
  removePermissions(@Body() dto: UpdateRolePermissions) {
    return this.roleService.removePermissions(dto);
  }
}
