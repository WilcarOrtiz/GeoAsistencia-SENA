import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../access-control-module/roles/roles.service';
import { UpdateRolesUserDto } from './dto/update-roles-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
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
    /*actualizar rol roles que tiene un usuario */
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
