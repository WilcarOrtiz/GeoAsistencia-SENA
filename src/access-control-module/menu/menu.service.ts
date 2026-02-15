import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { EntityManager, In, Repository } from 'typeorm';
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
        `El permiso ${createMenuDto.permission_name} no existe`,
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
      if (!parentExists) throw new NotFoundException('El menú padre no existe');
    }
    return await repo.save(newMenu);
  }

  async findMenusByPermissions(
    permissionIds: string[],
    manager?: EntityManager,
  ): Promise<NavigationItemDto[]> {
    const repo = this.getRepo(manager);
    const menus = await repo.find({
      where: { permission: { id: In(permissionIds) } },
      relations: ['children'],
      order: { order_index: 'ASC' },
    });
    return this.formatTree(menus.filter((menu) => !menu.parent_id));
  }

  private formatTree(menus: Menu[]): NavigationItemDto[] {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      route: menu.route,
      icon: menu.icon,
      order_index: menu.order_index,
      children: menu.children ? this.formatTree(menu.children) : [],
    }));
  }

  async deleteAll(manager?: EntityManager) {
    await this.getRepo(manager)
      .createQueryBuilder()
      .delete()
      .from(Menu)
      .execute();
  }
}
