import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { IPermissionSystemCreate } from './interface/permission-system.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  private getRepo(manager?: EntityManager) {
    return manager ? manager.getRepository(Permission) : this.permissionRepo;
  }

  async create(body: IPermissionSystemCreate, manager?: EntityManager) {
    const repo = this.getRepo(manager);
    const permission = repo.create(body);
    const saved = await repo.save(permission);
    return saved;
  }

  async deleteAllPermissions(manager?: EntityManager) {
    const repo = this.getRepo(manager);
    return await repo.createQueryBuilder().delete().where({}).execute();
  }

  async find(options: {
    names?: string[];
    pagination?: PaginationDto;
    withRoles?: boolean;
    manager?: EntityManager;
  }) {
    const { names, pagination, withRoles = false, manager } = options;
    const repo = this.getRepo(manager);

    return await repo.find({
      where: names ? { name: In(names) } : {},
      take: pagination?.limit,
      skip: pagination?.offset,
      relations: { roles: withRoles },
      order: {
        name: 'ASC',
      },
    });
  }
}
