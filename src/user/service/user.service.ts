import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../../access-control-module/roles/roles.service';
import { AuthService } from 'src/auth/auth.service';
import { MenuService } from '../../access-control-module/menu/menu.service';

import { isUUID } from 'class-validator';
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

  private baseUserQuery() {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('user.teacher', 'teacher');
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

  private async ensureUserIdNotTaken(ID: string, excludeAuthId?: string) {
    const existing = await this.userRepo.findOneBy({ ID_user: ID });
    if (existing && existing.auth_id !== excludeAuthId) {
      throw new BadRequestException(
        `Ya existe un usuario con el documento ${ID}`,
      );
    }
  }

  private async findAndValidateRoles(rolesID: string[]): Promise<Role[]> {
    const roles = await this.rolesService.find({ ids: rolesID });
    if (roles.length !== rolesID.length) {
      throw new BadRequestException('Algún rol no es válido');
    }
    return roles;
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

    await this.ensureUserIdNotTaken(ID);
    const roles = await this.findAndValidateRoles(rolesID);
    const userIdAuth = await this.authService.createUserCredentials(email, ID);

    return await this.userRepo.manager.transaction(
      async (manager: EntityManager) => {
        try {
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

  async update(auth_id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.ID)
      await this.ensureUserIdNotTaken(updateUserDto.ID, auth_id);

    const user = await this.userRepo.preload({
      auth_id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    if (!user.is_active) throw new BadRequestException(` usuario inactivo`);
    return this.userRepo.save(user);
  }

  async updateRoles(id: string, { rolesID }: UpdateRolesUserDto) {
    const user = await this.userRepo.findOne({
      where: { auth_id: id },
      relations: ['roles'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const newRoles = await this.findAndValidateRoles(rolesID);

    return this.userRepo.manager.transaction(async (manager) => {
      user.roles = newRoles;
      const savedUser = await manager.save(user);
      await this.userProfileService.syncProfiles(manager, id, newRoles);
      return savedUser;
    });
  }

  async findOne(term: string, accessCriteria: AccessCriteria): Promise<User> {
    const qb = this.baseUserQuery();
    if (isUUID(term)) {
      qb.where('user.auth_id = :auth_id', { auth_id: term });
    } else {
      qb.where('user.ID_user = :idUser', { idUser: term });
    }

    if (accessCriteria.is_active !== undefined) {
      qb.andWhere('user.is_active = :isActive', {
        isActive: accessCriteria.is_active,
      });
    }

    const user = await qb.getOne();
    if (!user) throw new NotFoundException(`Usuario "${term}" no encontrado`);
    return user;
  }

  async findAll(
    findAllUsersDto: FindAllUsersDto,
    accessCriteria: AccessCriteria,
  ) {
    const { limit = 10, offset = 0, roleId } = findAllUsersDto;
    const qb = this.baseUserQuery();

    if (accessCriteria.is_active !== undefined) {
      qb.andWhere('user.is_active = :isActive', {
        isActive: accessCriteria.is_active,
      });
    }

    if (roleId) qb.andWhere('roles.id = :roleId', { roleId });

    qb.orderBy('user.created_at', 'DESC');
    const [users, total] = await qb.take(limit).skip(offset).getManyAndCount();

    return {
      data: users,
      total,
      limit,
      offset,
    };
  }

  async setStatus(id: string, status: boolean): Promise<User> {
    const user = await this.userRepo.findOneBy({ auth_id: id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.is_active === status)
      throw new BadRequestException(
        `El usuario ya está ${status ? 'activo' : 'inactivo'}`,
      );
    user.is_active = status;
    return this.userRepo.save(user);
  }

  async getUserProfile(id: string): Promise<UserMeResponseDto> {
    const dbUser = await this.validateActiveUserByAuthId(id);
    if (!dbUser) throw new NotFoundException('Usuario no encontrado');
    const navigation = await this.menuService.findMenusByPermissions(
      dbUser.processedPermissionIds,
    );

    const fullName = [
      dbUser.first_name,
      dbUser.middle_name,
      dbUser.last_name,
      dbUser.second_last_name,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      user: {
        id: dbUser.ID_user,
        authId: dbUser.auth_id,
        firstName: dbUser.first_name,
        middleName: dbUser.middle_name,
        lastName: dbUser.last_name,
        secondLastName: dbUser.second_last_name,
        fullName,
        isActive: dbUser.is_active,
      },
      roles: dbUser.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
      permissions: dbUser.processedPermissions,
      navigation,
    };
  }

  async deleteAllUser(manager?: EntityManager): Promise<{ message: string }> {
    const repo = manager ? manager.getRepository(User) : this.userRepo;

    try {
      await repo.query('DELETE FROM "user_roles"');
      await repo.createQueryBuilder().delete().where({}).execute();
      await this.authService.deleteAllUserCredentials();

      return {
        message: 'Usuario eliminados (DB + Auth)',
      };
    } catch (error) {
      console.error('Error al limpiar la tabla de usuarios:', error);
      throw new InternalServerErrorException(
        'Error al limpiar los usuarios en la DB o Auth',
      );
    }
  }

  async validateActiveUserByAuthId(authId: string) {
    const user = await this.activeUserWithPermissionsQuery(authId).getOne();
    if (!user) return null;

    const rolesValidos = this.rolesService.validateRolesIntegrity(user);
    const { names, ids } = this.rolesService.getUniquePermissions(rolesValidos);

    return {
      ...user,
      roles: rolesValidos,
      processedPermissions: names,
      processedPermissionIds: ids,
    };
  }
}
