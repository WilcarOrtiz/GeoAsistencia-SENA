import { Injectable } from '@nestjs/common';
import { PermissionsService } from 'src/access-control-module/permissions/permissions.service';
import { initialData } from './data/seed-data';
import { RolesService } from 'src/access-control-module/roles/roles.service';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly permissionService: PermissionsService,
    private readonly rolesService: RolesService,
  ) {}

  async runSeed() {
    return await this.dataSource.transaction(async (manager) => {
      await this.rolesService.deleteAllRoles(manager);
      await this.permissionService.deleteAllPermissions(manager);

      for (const permission of initialData.permissions) {
        await this.permissionService.create(permission, manager);
      }

      for (const role of initialData.roles) {
        await this.rolesService.create(role, manager);
      }

      return 'SEED EXECUTED SUCCESSFULLY WILCAR';
    });
  }
}
