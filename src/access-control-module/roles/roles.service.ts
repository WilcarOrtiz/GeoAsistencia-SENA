import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { IRoleSystemCreate } from './role-system.interface';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly permissionService: PermissionsService,
  ) {}

  async create(body: IRoleSystemCreate, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Role) : this.roleRepo;
    const { name, description, permissions } = body;

    const permissionsDB = await this.permissionService.findManyByNames(
      permissions,
      manager,
    );

    const newRole = repo.create({
      name,
      description,
      permissions: permissionsDB,
    });

    return await repo.save(newRole);
  }

  async deleteAllRoles(manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Role) : this.roleRepo;
    return await repo.createQueryBuilder().delete().where({}).execute();
  }

  async addPermissions(dto: UpdateRolePermissions) {
    const { roleId, permissionIds } = dto;

    if (!permissionIds || permissionIds.length === 0) return { added: 0 };

    const uniqueIds = [...new Set(permissionIds)];

    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Role not found');

    const existingIds = new Set(role.permissions.map((p) => p.id));
    const idsToAdd = uniqueIds.filter((id) => !existingIds.has(id));

    if (idsToAdd.length === 0) return { added: 0 };

    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .add(idsToAdd);

    return { added: idsToAdd.length };
  }

  async removePermissions(dto: UpdateRolePermissions) {
    const { roleId, permissionIds } = dto;

    if (!permissionIds || permissionIds.length === 0) return { removed: 0 };

    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .remove(permissionIds);

    return { removed: permissionIds.length };
  }

  async findRoles(ids: string[]) {
    const roles = await this.roleRepo.findBy({
      id: In(ids),
    });

    if (roles.length !== ids.length)
      throw new NotFoundException('Uno o más roles no fueron encontrados');

    return roles;
  }
}

/*Acción,Recomendación de retorno
Crear,Retorna el objeto creado (para que el front lo añada a la lista).
Actualizar,Retorna el objeto actualizado.
Eliminar,Retorna solo un message confirmando la acción. */
