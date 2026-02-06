import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../access-control-module/roles/roles.service';
import { UpdateRolesUserDto } from './dto/update-roles-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserMeResponseDto } from './dto/user-me-response.dto';
import { MenuService } from '../access-control-module/menu/menu.service';

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

  async updateRoles(userId: string, updateRolesUserDto: UpdateRolesUserDto) {
    const user = await this.userRepo.findOne({
      where: { auth_id: userId },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User not found');

    const newRoles = await this.rolesService.findRoles(
      updateRolesUserDto.rolesID,
    );

    user.roles = newRoles;
    return await this.userRepo.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findAll(findAllUsersDto: FindAllUsersDto) {
    const { limit = 10, offset = 0, role } = findAllUsersDto;

    const query = this.userRepo
      .createQueryBuilder('USERS')
      .leftJoin('USERS.roles', 'ROLES')
      .where('USERS.is_active = :active', { active: true });

    if (role) {
      query.andWhere('ROLES.name = :roleName', {
        roleName: role.toLowerCase(),
      });
    }

    const [users, total] = await query
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: users,
      total,
    };
  }

  async findOneByAuthId(authId: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { auth_id: authId },
      relations: ['roles'],
    });
  }

  async getUserProfile(authId: string): Promise<UserMeResponseDto> {
    const user = await this.userRepo.findOne({
      where: { auth_id: authId },
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
}

/*✔️ Pon is_active en:

USERS ✅
SUBJECTS ✅
ROLES
ACTIONS
MODULES
CLASS_GROUPS
USERS_ROLES
STUDENT_GROUP (recomendado)

❌ NO pongas is_active en:

ATTENDANCE
CLASS_SESSIONS
DAYS
SEMESTERS*/
