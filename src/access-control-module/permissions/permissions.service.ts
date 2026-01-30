import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { IPermissionSystemCreate } from './permission-system.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(body: IPermissionSystemCreate, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Permission)
      : this.permissionRepo;

    const permission = repo.create(body);
    const saved = await repo.save(permission);

    return saved;
  }

  async findManyByNames(names: string[], manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Permission)
      : this.permissionRepo;
    return await repo.find({
      where: { name: In(names) },
    });
  }

  async deleteAllPermissions(manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Permission)
      : this.permissionRepo;
    return await repo.createQueryBuilder().delete().where({}).execute();
  }
}
