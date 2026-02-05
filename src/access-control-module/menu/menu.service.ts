import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { IMenuSystemCreate } from './interface/menu-system.interface';

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
}
