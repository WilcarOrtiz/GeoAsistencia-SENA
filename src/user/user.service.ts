import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../access-control-module/roles/roles.service';
import { UpdateRolesUserDto } from './dto/update-roles-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserMeResponseDto } from './dto/user-me-response.dto';
import { MenuService } from '../access-control-module/menu/menu.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';
import { AccessCriteria } from 'src/common/decorators/get-access-criteria.decorator';

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
    const roles = await this.rolesService.findRoles(createUserDto.rolesID);
    const userIdAuth = await this.authService.createUserCredentials(
      createUserDto.email,
      createUserDto.ID,
    );

    try {
      const user = this.userRepo.create({
        auth_id: userIdAuth,
        ID_user: createUserDto.ID,
        first_name: createUserDto.first_name,
        middle_name: createUserDto.middle_name,
        last_name: createUserDto.last_name,
        second_last_name: createUserDto.second_last_name,
        roles: roles,
      });

      return await this.userRepo.save(user);
    } catch (error) {
      await this.authService.deleteUserCredentials(userIdAuth);
      throw error;
    }
  }

  async update(auth_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      auth_id,
      ...updateUserDto,
    });

    if (!user)
      throw new NotFoundException(`Usuario con ${auth_id} no encontrado`);
    return this.userRepo.save(user);
  }

  async updateRoles(id: string, updateRolesUserDto: UpdateRolesUserDto) {
    const user = await this.userRepo.findOne({
      where: { auth_id: id },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const newRoles = await this.rolesService.findRoles(
      updateRolesUserDto.rolesID,
    );
    user.roles = newRoles;
    return await this.userRepo.save(user);
  }

  async deactivate(id: string) {
    const user = await this.userRepo.findOne({
      where: { auth_id: id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.is_active) {
      throw new BadRequestException('El usuario ya está inactivo');
    }

    user.is_active = false;
    return this.userRepo.save(user);
  }

  async activate(id: string) {
    const user = await this.userRepo.findOne({
      where: { auth_id: id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.is_active)
      throw new BadRequestException('El usuario ya está activo');

    user.is_active = true;
    return this.userRepo.save(user);
  }

  async getUserProfile(id: string): Promise<UserMeResponseDto> {
    const user = await this.userRepo.findOne({
      where: { auth_id: id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roleIds = user.roles.map((role) => role.id);
    const rolesWithPermissions =
      await this.rolesService.findRolesWithPermissions(roleIds);

    const permissionsSet = new Set<string>();
    const permissionIds: string[] = [];

    rolesWithPermissions.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionsSet.add(permission.name);
        permissionIds.push(permission.id);
      });
    });

    const navigation =
      await this.menuService.findMenusByPermissions(permissionIds);
    const fullName = [
      user.first_name,
      user.middle_name,
      user.last_name,
      user.second_last_name,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      user: {
        id: user.ID_user,
        authId: user.auth_id,
        firstName: user.first_name,
        middleName: user.middle_name,
        lastName: user.last_name,
        secondLastName: user.second_last_name,
        fullName,
        isActive: user.is_active,
      },
      roles: rolesWithPermissions.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
      permissions: Array.from(permissionsSet),
      navigation: navigation,
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

    if (!user)
      throw new NotFoundException(
        `Usuario con ${term} no encontrado o inaccesible`,
      );

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
      where: {
        auth_id: authId,
        is_active: true,
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    return user;
  }

  async deleteAllUser(manager?: EntityManager) {
    const repo = manager ? manager.getRepository(User) : this.userRepo;
    return await repo.createQueryBuilder().delete().where({}).execute();
  }
}
