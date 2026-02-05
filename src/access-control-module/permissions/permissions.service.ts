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

  async findOneByName(name: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Permission)
      : this.permissionRepo;

    return await repo.findOneBy({ name });
  }

  async deleteAllPermissions(manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Permission)
      : this.permissionRepo;
    return await repo.createQueryBuilder().delete().where({}).execute();
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    const permissions = await this.permissionRepo.find({
      take: limit,
      skip: offset,
      relations: {
        roles: true,
      },
    });

    return permissions;
  }
}
