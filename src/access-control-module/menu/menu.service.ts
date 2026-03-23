import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PermissionsService } from '../permissions/permissions.service';
import { Menu } from './entities/menu.entity';
import { IMenuSystemCreate } from './interface/menu-system.interface';
import { NavigationItemDto } from './dto/menu-response.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly permissionService: PermissionsService,
  ) {}

  private getRepo(manager?: EntityManager): Repository<Menu> {
    return manager ? manager.getRepository(Menu) : this.menuRepository;
  }

  async create(
    createMenuDto: IMenuSystemCreate,
    manager?: EntityManager,
  ): Promise<Menu> {
    const repo = this.getRepo(manager);
    const result = await this.permissionService.findAll({
      names: [createMenuDto.permission_name],
      manager,
    });

    const permission = result.data[0];

    if (!permission) {
      throw new NotFoundException(
        `El permiso ${createMenuDto.permission_name} no existe`,
      );
    }

    const newMenu = repo.create({
      name: createMenuDto.name,
      route: createMenuDto.route,
      icon: createMenuDto.icon,
      order_index: createMenuDto.order_index ?? 0,
      permission: permission,
      parent: createMenuDto.parent_id
        ? { id: createMenuDto.parent_id }
        : undefined,
    });

    if (createMenuDto.parent_id) {
      const parentExists = await repo.findOneBy({
        id: createMenuDto.parent_id,
      });
      if (!parentExists)
        throw new NotFoundException('El menú principal/Padre no existe');
    }
    return await repo.save(newMenu);
  }

  async getMenuTreeByPermissions(
    permissionIds: string[],
    manager?: EntityManager,
  ): Promise<NavigationItemDto[]> {
    const repo = this.getRepo(manager);
    const allMenus = await repo.find({
      relations: ['permission'],
      order: { order_index: 'ASC' },
    });
    return this.buildTree(allMenus, permissionIds, null);
  }

  private buildTree(
    allMenus: Menu[],
    permissionIds: string[],
    parentId: string | null = null,
  ): NavigationItemDto[] {
    const currentLevel = allMenus.filter((m) =>
      parentId === null ? !m.parent_id : m.parent_id === parentId,
    );

    const tree: NavigationItemDto[] = [];

    for (const menu of currentLevel) {
      const children = this.buildTree(allMenus, permissionIds, menu.id);
      const hasDirectPermission =
        !menu.permission || permissionIds.includes(menu.permission.id);

      const hasAllowedChildren = children.length > 0;

      if (hasDirectPermission || hasAllowedChildren) {
        if (menu.route || hasAllowedChildren) {
          tree.push({
            id: menu.id,
            name: menu.name,
            route: menu.route,
            icon: menu.icon,
            order_index: menu.order_index,
            children: children,
          });
        }
      }
    }

    return tree;
  }

  async deleteAll(manager?: EntityManager): Promise<void> {
    await this.getRepo(manager)
      .createQueryBuilder()
      .delete()
      .from(Menu)
      .execute();
  }
}
