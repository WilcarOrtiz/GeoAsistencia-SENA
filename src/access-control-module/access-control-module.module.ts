import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles/roles.service';
import { PermissionsService } from './permissions/permissions.service';
import { Permission } from './permissions/permission.entity';
import { Role } from './roles/role.entity';
import { RoleController } from './roles/role.controller';
import { UserModule } from 'src/user/user.module';
import { PermissionsController } from './permissions/permissions.controller';

@Module({
  controllers: [RoleController, PermissionsController],
  providers: [RolesService, PermissionsService],
  imports: [
    TypeOrmModule.forFeature([Permission, Role]),
    forwardRef(() => UserModule),
  ],
  exports: [PermissionsService, RolesService, TypeOrmModule],
})
export class AccessControlModuleModule {}
