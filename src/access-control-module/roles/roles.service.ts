import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { IRoleSystemCreate } from './interface/role-system.interface';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly permissionService: PermissionsService,
  ) {}

  private getRepo(manager?: EntityManager) {
    return manager ? manager.getRepository(Role) : this.roleRepo;
  }

  async create(body: IRoleSystemCreate, manager?: EntityManager) {
    const repo = this.getRepo(manager);
    const { name, description } = body;

    const permissionsDB = await this.permissionService.find({
      names: body.permissions,
      manager,
    });

    const newRole = repo.create({
      name,
      description,
      permissions: permissionsDB,
    });

    return await repo.save(newRole);
  }

  async deleteAllRoles(manager?: EntityManager) {
    return await this.getRepo(manager)
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async syncPermissions(dto: UpdateRolePermissions) {
    const { roleId, permissionIds } = dto;
    const [role] = await this.find({ ids: [roleId], withPermissions: true });
    role.permissions = permissionIds.map((id) => ({ id }) as Permission);
    return await this.roleRepo.save(role);
  }

  getUniquePermissions(roles: Role[]) {
    const allPermissions = roles.flatMap((r) => r.permissions ?? []);
    return {
      names: [...new Set(allPermissions.map((p) => p.name))],
      ids: allPermissions.map((p) => p.id),
    };
  }

  async find(options: {
    ids?: string[];
    withPermissions?: boolean;
    pagination?: PaginationDto;
    manager?: EntityManager;
  }) {
    const { ids, withPermissions = false, pagination, manager } = options;
    const repo = this.getRepo(manager);

    const roles = await repo.find({
      where: ids ? { id: In(ids) } : {},
      relations: { permissions: withPermissions },
      take: pagination?.limit,
      skip: pagination?.offset,
    });

    if (ids && roles.length !== [...new Set(ids)].length) {
      throw new NotFoundException('One or more roles were not found');
    }
    return roles;
  }
}
