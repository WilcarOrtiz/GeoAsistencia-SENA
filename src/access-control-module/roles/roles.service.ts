import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';
import { FindRoleOptions, IRoleSystemCreate } from './interface';
import { Role } from './entities/role.entity';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

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

  async create(
    body: IRoleSystemCreate,
    manager?: EntityManager,
  ): Promise<Role> {
    const repo = this.getRepo(manager);
    const { name, description, permissions } = body;

    const permissionsResult = await this.permissionService.findAll({
      names: permissions,
      manager,
    });

    const newRole = repo.create({
      name,
      description,
      permissions: permissionsResult.data,
    });

    return await repo.save(newRole);
  }

  getUniquePermissions(roles: Role[]): { names: string[]; ids: string[] } {
    const allPermissions = roles.flatMap((r) => r.permissions ?? []);
    return {
      names: [...new Set(allPermissions.map((p) => p.name))],
      ids: allPermissions.map((p) => p.id),
    };
  }

  async deleteAllRoles(manager?: EntityManager): Promise<{ message: string }> {
    const repo = this.getRepo(manager);
    await repo.query('DELETE FROM "roles_permissions"');
    await repo.createQueryBuilder().delete().execute();
    return { message: 'Todos los roles y permisos han sido eliminados' };
  }

  async findByIds(
    ids: string[],
    manager?: EntityManager,
    withPermissions = false,
  ): Promise<Role[]> {
    const repo = this.getRepo(manager);

    const roles = await repo.find({
      where: {
        id: In(ids),
        is_active: true,
      },
      relations: { permissions: withPermissions },
    });

    if (roles.length !== [...new Set(ids)].length) {
      throw new NotFoundException('Uno o más roles no existen');
    }

    return roles;
  }

  async findOneById(
    id: string,
    manager?: EntityManager,
    withPermissions = false,
  ): Promise<Role> {
    const repo = this.getRepo(manager);
    const role = await repo.findOne({
      where: { id, is_active: true },
      relations: { permissions: withPermissions },
    });

    if (!role) {
      throw new NotFoundException('El rol no existe');
    }

    return role;
  }

  /*  async syncPermissions(dto: UpdateRolePermissions): Promise<Role> {
    const { roleId, permissionIds } = dto;

    const exists = await this.roleRepo.exist({
      where: { id: roleId, is_active: true },
    });

    if (!exists) {
      throw new NotFoundException('El rol no existe');
    }

    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .set(permissionIds);

    return await this.findOneById(roleId, undefined, true);
  }*/

  async syncPermissions(dto: UpdateRolePermissions): Promise<Role> {
    const { roleId, permissionIds } = dto;

    const exists = await this.roleRepo.exist({
      where: { id: roleId, is_active: true },
    });
    if (!exists) throw new NotFoundException('El rol no existe');

    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('El rol no existe');
    }

    const currentIds = role.permissions.map((p) => p.id);

    await this.roleRepo.manager
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .addAndRemove(
        permissionIds,
        currentIds.filter((id) => !permissionIds.includes(id)),
      );

    return this.findOneById(roleId, undefined, true);
  }

  async findAll(options: FindRoleOptions): Promise<PaginatedResponseDto<Role>> {
    const { ids, withPermissions = false, pagination, manager } = options;
    const repo = this.getRepo(manager);

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const offset = (page - 1) * limit;

    const [data, total] = await repo.findAndCount({
      where: {
        is_active: true,
        ...(ids ? { id: In(ids) } : {}),
      },
      relations: { permissions: withPermissions },
      take: limit,
      skip: offset,
    });

    if (ids && data.length !== [...new Set(ids)].length) {
      throw new NotFoundException('No se encontraron uno o más roles');
    }

    return {
      data,
      total,
      limit,
      page,
    };
  }
}
