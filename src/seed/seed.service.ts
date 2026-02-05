import { Injectable } from '@nestjs/common';
import { PermissionsService } from 'src/access-control-module/permissions/permissions.service';
import { initialData } from './data/seed-data';
import { RolesService } from 'src/access-control-module/roles/roles.service';
import { DataSource } from 'typeorm';
import { MenuService } from '../access-control-module/menu/menu.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly permissionService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly menuService: MenuService,
  ) {}

  async runSeed() {
    return await this.dataSource.transaction(async (manager) => {
      await this.menuService.deleteAll(manager);
      await this.rolesService.deleteAllRoles(manager);
      await this.permissionService.deleteAllPermissions(manager);

      for (const permission of initialData.permissions) {
        await this.permissionService.create(permission, manager);
      }

      for (const role of initialData.roles) {
        await this.rolesService.create(role, manager);
      }

      const parentMenus = initialData.menus.filter((m) => !m.parent_name);
      const createdParentsMap = new Map<string, string>();

      for (const menuDto of parentMenus) {
        const created = await this.menuService.create(menuDto, manager);
        createdParentsMap.set(created.name, created.id);
      }

      const childMenus = initialData.menus.filter((m) => m.parent_name);

      for (const menuDto of childMenus) {
        const parentId = createdParentsMap.get(menuDto.parent_name!);
        if (!parentId)
          throw new Error(
            `No se encontró el ID del padre para el menú: ${menuDto.name}`,
          );

        await this.menuService.create(
          {
            ...menuDto,
            parent_id: parentId,
          },
          manager,
        );
      }
      return 'SEED EXECUTED SUCCESSFULLY';
    });
  }
}
