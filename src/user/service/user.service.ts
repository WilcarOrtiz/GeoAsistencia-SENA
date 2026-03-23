import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../../access-control-module/roles/roles.service';
import { AuthService } from 'src/auth/auth.service';
import { MenuService } from '../../access-control-module/menu/menu.service';

import { AccessCriteria } from 'src/common/decorators/get-access-criteria.decorator';
import {
  CreateUserDto,
  FindAllUsersDto,
  UpdateRolesUserDto,
  UpdateUserDto,
  UserMeResponseDto,
} from '../dto';

import { User } from '../entities/user.entity';
import { UserProfileService } from './user-profile.service';
import { Role } from 'src/access-control-module/roles/entities/role.entity';
import { ICurrentUser } from 'src/common/interface/current-user.interface';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly menuService: MenuService,
    private userProfileService: UserProfileService,
  ) {}

  private baseListQuery() {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .select([
        'user.auth_id',
        'user.ID_user',
        'user.first_name',
        'user.middle_name',
        'user.last_name',
        'user.second_last_name',
        'user.is_active',
        'user.created_at',
        'roles.id',
        'roles.name',
      ]);
  }

  private activeUserWithPermissionsQuery(authId: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .leftJoinAndSelect('user.student', 'student', 'student.is_active = true')
      .leftJoinAndSelect('user.teacher', 'teacher', 'teacher.is_active = true')
      .where('user.auth_id = :authId', { authId })
      .andWhere('user.is_active = true');
  }

  private async validateUniqueUserId(ID: string, excludeAuthId?: string) {
    const user = await this.userRepo.findOneBy({ ID_user: ID });
    if (user && user.auth_id !== excludeAuthId) {
      throw new BadRequestException(
        `A user with the document already exists ${ID}`,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      ID,
      email,
      first_name,
      last_name,
      rolesID,
      middle_name,
      second_last_name,
    } = createUserDto;

    await this.validateUniqueUserId(ID);

    const userIdAuth = await this.authService.createUserCredentials(email, ID);

    return await this.userRepo.manager.transaction(
      async (manager: EntityManager) => {
        try {
          const roles = await this.rolesService.findByIds(rolesID, manager);

          const user = manager.create(User, {
            auth_id: userIdAuth,
            ID_user: ID,
            first_name,
            middle_name,
            last_name,
            second_last_name,
            roles: roles,
          });

          const savedUser = await manager.save(user);

          await this.userProfileService.createProfiles(
            manager,
            savedUser.auth_id,
            roles,
          );

          return savedUser;
        } catch (error) {
          await this.authService.deleteUserCredentials(userIdAuth);
          throw error;
        }
      },
    );
  }

  async update(auth_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.ID)
      await this.validateUniqueUserId(updateUserDto.ID, auth_id);

    const user = await this.userRepo.preload({
      auth_id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    if (!user.is_active) throw new BadRequestException(` usuario inactivo`);
    return this.userRepo.save(user);
  }

  async updateRoles(
    id: string,
    { rolesID }: UpdateRolesUserDto,
  ): Promise<Role[]> {
    const user = await this.userRepo.findOne({
      where: { auth_id: id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return this.userRepo.manager.transaction(async (manager) => {
      const newRoles = await this.rolesService.findByIds(rolesID, manager);

      const currentRoles = await manager
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(id)
        .loadMany<Role>();

      const currentIds = currentRoles.map((r) => r.id);

      await manager
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(id)
        .addAndRemove(
          rolesID,
          currentIds.filter((id) => !rolesID.includes(id)),
        );

      await this.userProfileService.syncProfiles(manager, id, newRoles);
      return newRoles;
    });
  }

  async findAll(
    options: FindAllUsersDto,
    accessCriteria: AccessCriteria,
  ): Promise<PaginatedResponseDto<User>> {
    const { limit = 10, page = 1, roleId } = options;

    const offset = (page - 1) * limit;

    const qb = this.baseListQuery();

    if (accessCriteria.is_active !== undefined) {
      qb.andWhere('user.is_active = :isActive', {
        isActive: accessCriteria.is_active,
      });
    }

    if (roleId) {
      qb.andWhere('roles.id = :roleId', { roleId });
    }

    qb.orderBy('user.created_at', 'DESC');

    const [data, total] = await qb.take(limit).skip(offset).getManyAndCount();

    return {
      data,
      total,
      limit,
      page,
    };
  }

  async setStatus(
    id: string,
    status: boolean,
  ): Promise<{ is_active: boolean }> {
    const user = await this.userRepo.findOneBy({ auth_id: id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.is_active === status)
      throw new BadRequestException(
        `El usuario ya está ${status ? 'activo' : 'inactivo'}`,
      );

    await this.userRepo.update({ auth_id: id }, { is_active: status });
    return { is_active: status };
  }

  async deleteAllUser(manager?: EntityManager): Promise<{ message: string }> {
    const repo = manager ? manager.getRepository(User) : this.userRepo;
    await repo.query('DELETE FROM "user_roles"');
    await repo.createQueryBuilder().delete().where({}).execute();
    await this.authService.deleteAllUserCredentials();
    return { message: 'Usuario eliminados (DB + Auth)' };
  }

  async getUserProfile(currentUser: ICurrentUser): Promise<UserMeResponseDto> {
    const navigation = await this.menuService.getMenuTreeByPermissions(
      currentUser.permissionIds,
    );

    return {
      user: {
        id: currentUser.ID_user,
        authId: currentUser.authId,
        fullName: currentUser.fullName,
        isActive: currentUser.is_active,
      },
      roles: currentUser.roles,
      permissions: currentUser.permissions,
      navigation,
    };
  }

  async validateActiveUserByAuthId(authId: string) {
    const user = await this.activeUserWithPermissionsQuery(authId).getOne();
    if (!user) return null;

    const rolesValidos = user.getValidRoles();
    const { names, ids } = this.rolesService.getUniquePermissions(rolesValidos);

    return {
      user: user,
      roles: rolesValidos,
      processedPermissions: names,
      processedPermissionIds: ids,
    };
  }
}
