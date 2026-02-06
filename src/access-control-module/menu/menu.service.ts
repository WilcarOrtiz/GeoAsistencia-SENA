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
  async create(createMenuDto: IMenuSystemCreate, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Menu) : this.menuRepository;

    const permission = await this.permissionService.findOneByName(
      createMenuDto.permission_name,
      manager,
    );

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
    });

    if (createMenuDto.parent_id) {
      const parent = await repo.findOneBy({
        id: createMenuDto.parent_id,
      });
      if (!parent) {
        throw new NotFoundException('El menú padre no existe');
      }
      newMenu.parent = parent;
    }

    return await repo.save(newMenu);
  }

  async deleteAll(manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Menu) : this.menuRepository;

    await repo.createQueryBuilder().delete().from(Menu).execute();
  }
  async findMenusByPermissions(
    permissionIds: string[],
    manager?: EntityManager,
  ): Promise<NavigationItemDto[]> {
    const repo = manager ? manager.getRepository(Menu) : this.menuRepository;

    const menus = await repo.find({
      where: { permission: { id: In(permissionIds) } },
      relations: ['children'],
      order: { order_index: 'ASC' },
    });
    const rootMenus = menus.filter((menu) => !menu.parent_id);
    return this.formatTree(rootMenus);
  }

  private formatTree(menus: Menu[]): NavigationItemDto[] {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      route: menu.route,
      icon: menu.icon,
      order_index: menu.order_index,
      // Se llama a sí misma: si hay hijos los formatea, si no, devuelve []
      children: menu.children ? this.formatTree(menu.children) : [],
    }));
  }
}
