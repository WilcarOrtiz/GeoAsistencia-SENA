import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../access-control-module/roles/roles.service';
import { AuthService } from 'src/auth/auth.service';
import { MenuService } from '../access-control-module/menu/menu.service';

import { isUUID } from 'class-validator';
import { AccessCriteria } from 'src/common/decorators/get-access-criteria.decorator';
import {
  CreateUserDto,
  FindAllUsersDto,
  UpdateRolesUserDto,
  UpdateUserDto,
  UserMeResponseDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly menuService: MenuService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const {
      ID,
      email,
      first_name,
      last_name,
      rolesID,
      middle_name,
      second_last_name,
    } = createUserDto;
    const existingUser = await this.userRepo.findOneBy({
      ID_user: ID,
    });
    if (existingUser) {
      throw new BadRequestException(
        `Ya existe un usuario con el documento ${ID}`,
      );
    }

    const roles = await this.rolesService.find({ ids: rolesID });
    if (roles.length !== rolesID.length) {
      throw new BadRequestException(
        'Uno o más roles seleccionados no son válidos',
      );
    }

    const userIdAuth = await this.authService.createUserCredentials(email, ID);

    try {
      const user = this.userRepo.create({
        auth_id: userIdAuth,
        ID_user: createUserDto.ID,
        first_name,
        middle_name,
        last_name,
        second_last_name,
        roles: roles,
      });

      return await this.userRepo.save(user);
    } catch (error) {
      await this.authService.deleteUserCredentials(userIdAuth);
      throw error;
    }
  }

  async update(auth_id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.ID) {
      const existing = await this.userRepo.findOneBy({
        ID_user: updateUserDto.ID,
      });
      if (existing && existing.auth_id !== auth_id) {
        throw new BadRequestException(
          'Ya existe un usuario con ese número de identificación',
        );
      }
    }

    const user = await this.userRepo.preload({
      auth_id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    return this.userRepo.save(user);
  }

  async updateRoles(id: string, updateRolesUserDto: UpdateRolesUserDto) {
    const { rolesID } = updateRolesUserDto;

    const user = await this.userRepo.findOneBy({ auth_id: id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const newRoles = await this.rolesService.find({ ids: rolesID });

    if (newRoles.length !== rolesID.length) {
      throw new BadRequestException(
        'Uno o más roles proporcionados no son válidos',
      );
    }

    user.roles = newRoles;
    return await this.userRepo.save(user);
  }

  async setStatus(id: string, status: boolean) {
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

  async findOne(term: string, accessCriteria: AccessCriteria) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');

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
    if (!user) throw new NotFoundException(`Usuario con ${term} no encontrado`);

    return user;
  }

  async findAll(
    findAllUsersDto: FindAllUsersDto,
    accessCriteria: AccessCriteria,
  ) {
    const { limit = 10, offset = 0, roleId } = findAllUsersDto;

    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');

    if (accessCriteria.is_active !== undefined) {
      query.andWhere('user.is_active = :isActive', {
        isActive: accessCriteria.is_active,
      });
    }

    if (roleId) query.andWhere('roles.id = :roleId', { roleId });

    const [users, total] = await query
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return { data: users, total };
  }

  async validateActiveUserByAuthId(authId: string) {
    const user = await this.userRepo.findOne({
      where: { auth_id: authId, is_active: true },
      relations: { roles: { permissions: true } },
    });

    if (!user) return null;

    const { names, ids } = this.rolesService.getUniquePermissions(user.roles);

    return {
      ...user,
      processedPermissions: names,
      processedPermissionIds: ids,
    };
  }

  async deleteAllUser(manager?: EntityManager) {
    const repo = manager ? manager.getRepository(User) : this.userRepo;
    try {
      await repo.query('DELETE FROM "user_roles"');
      await repo.createQueryBuilder().delete().where({}).execute();
      await this.authService.deleteAllUserCredentials();
      return { message: 'Todos los usuarios (Auth y DB) han sido eliminados' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al limpiar la tabla de usuarios en la DB',
      );
    }
  }
}
