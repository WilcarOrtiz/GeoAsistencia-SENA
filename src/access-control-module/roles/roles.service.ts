import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { IRoleSystemCreate } from './interface/role-system.interface';

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

  async syncPermissions(dto: UpdateRolePermissions): Promise<Role> {
    const { roleId, permissionIds } = dto;
    const role = await this.findOneById(roleId, undefined, true);
    const uniquePermissionIds = [...new Set(permissionIds)];
    role.permissions = uniquePermissionIds.map((id) => ({ id }) as Permission);
    await this.roleRepo.save(role);
    return this.findOneById(roleId, undefined, true);
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.findOneById(roleId);

    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .remove(permissionId);
  }

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    const role = await this.findOneById(roleId, undefined, true);

    const alreadyHas = role.permissions.some((p) => p.id === permissionId);
    if (alreadyHas) return;

    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .add(permissionId);
  }

  async findAll(): Promise<Role[]> {
    const data = await this.roleRepo.find({
      where: {
        is_active: true,
      },
    });

    return data;
  }
}
