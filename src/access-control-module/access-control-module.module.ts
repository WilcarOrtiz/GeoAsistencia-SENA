import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles/roles.service';
import { PermissionsService } from './permissions/permissions.service';
import { Permission } from './permissions/entities/permission.entity';
import { Role } from './roles/entities/role.entity';
import { RoleController } from './roles/role.controller';
import { PermissionsController } from './permissions/permissions.controller';
import { MenuService } from './menu/menu.service';
import { Menu } from './menu/entities/menu.entity';

@Module({
  controllers: [RoleController, PermissionsController],
  providers: [RolesService, PermissionsService, MenuService],
  imports: [TypeOrmModule.forFeature([Permission, Role, Menu])],
  exports: [PermissionsService, RolesService, MenuService, TypeOrmModule],
})
export class AccessControlModuleModule {}
