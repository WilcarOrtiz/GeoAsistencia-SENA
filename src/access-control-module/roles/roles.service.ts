import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { IRoleSystemCreate } from './interface/role-system.interface';
import { UpdateRolePermissions } from './dto/UpdateRolePermissions.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { ValidRole } from 'src/common/enums/valid-role.enum';
import { RoleResponseDto } from './dto/role-response.dto';

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

  async syncPermissions(dto: UpdateRolePermissions): Promise<RoleResponseDto> {
    const { roleId, permissionIds } = dto;
    const [role] = await this.find({ ids: [roleId], withPermissions: true });
    role.permissions = permissionIds.map((id) => ({ id }) as Permission);
    return await this.roleRepo.save(role);
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

    try {
      await repo.query('DELETE FROM "roles_permissions"');
      await repo.createQueryBuilder().delete().execute();
      return { message: 'Todos los roles y permisos han sido eliminados' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al limpiar roles en DB');
    }
  }

  async find(options: {
    ids?: string[];
    withPermissions?: boolean;
    pagination?: PaginationDto;
    manager?: EntityManager;
  }): Promise<Role[]> {
    const { ids, withPermissions = false, pagination, manager } = options;
    const repo = this.getRepo(manager);

    const roles = await repo.find({
      where: {
        is_active: true,
        ...(ids ? { id: In(ids) } : {}),
      },
      relations: { permissions: withPermissions },
      take: pagination?.limit,
      skip: pagination?.offset,
    });

    if (ids && roles.length !== [...new Set(ids)].length) {
      throw new NotFoundException('One or more roles were not found');
    }
    return roles;
  }

  validateRolesIntegrity(user: User): Role[] {
    return user.roles.filter((role) => {
      const name = role.name.toUpperCase() as ValidRole;

      if (name === ValidRole.STUDENT)
        return !!user.student && user.student.is_active;

      if (name === ValidRole.TEACHER)
        return !!user.teacher && user.teacher.is_active;

      return true;
    });
  }
}
