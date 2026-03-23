import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { IPermissionSystemCreate } from './interface/permission-system.interface';
import { FindPermissionsOptions } from './interface/find-permissions-options.interface';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<Permission> {
    return manager ? manager.getRepository(Permission) : this.permissionRepo;
  }

  async create(
    body: IPermissionSystemCreate,
    manager?: EntityManager,
  ): Promise<Permission> {
    const repo = this.getRepo(manager);
    const permission = repo.create(body);
    return await repo.save(permission);
  }

  async findAll(
    options: FindPermissionsOptions,
  ): Promise<PaginatedResponseDto<Permission>> {
    const { names, pagination, withRoles = false, manager } = options;

    const repo = this.getRepo(manager);

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const offset = (page - 1) * limit;

    const [data, total] = await repo.findAndCount({
      where: names ? { name: In(names) } : {},
      take: limit,
      skip: offset,
      relations: { roles: withRoles },
      order: {
        name: 'ASC',
      },
    });

    return {
      data,
      total,
      limit,
      page,
    };
  }

  async deleteAll(manager?: EntityManager): Promise<void> {
    const repo = this.getRepo(manager);
    await repo.createQueryBuilder().delete().where({}).execute();
  }
}
