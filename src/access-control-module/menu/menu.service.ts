import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { IMenuSystemCreate } from './interface/menu-system.interface';
import { NavigationItemDto } from 'src/user/dto/user-me-response.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly permissionService: PermissionsService,
  ) {}

  private getRepo(manager?: EntityManager) {
    return manager ? manager.getRepository(Menu) : this.menuRepository;
  }

  async create(createMenuDto: IMenuSystemCreate, manager?: EntityManager) {
    const repo = this.getRepo(manager);
    const [permission] = await this.permissionService.find({
      names: [createMenuDto.permission_name],
      manager,
    });

    if (!permission)
      throw new NotFoundException(
        `The permission ${createMenuDto.permission_name} does not exist`,
      );

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
        throw new NotFoundException('The parent menu does not exist');
    }
    return await repo.save(newMenu);
  }

  async findMenusByPermissions(
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

      // ¿Tiene hijos permitidos?
      const hasAllowedChildren = children.length > 0;

      // EL FILTRO CLAVE:
      // El menú se incluye si (Tiene permiso directo O tiene hijos permitidos)
      // Y además (Tiene una ruta O tiene hijos) -> para evitar carpetas vacías
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

  async deleteAll(manager?: EntityManager) {
    await this.getRepo(manager)
      .createQueryBuilder()
      .delete()
      .from(Menu)
      .execute();
  }
}
