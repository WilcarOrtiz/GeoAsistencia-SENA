import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthService } from './user-auth.service';
import { RolesService } from '../../access-control-module/roles/roles.service';
import { UpdateRolesUserDto } from '../dto/updateRoles-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userAuthService: UserAuthService,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const roles = await this.rolesService.findRoles(createUserDto.rolesID);
    const userIdAuth = await this.userAuthService.createUserCredentials(
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
      await this.userAuthService.deleteUserCredentials(userIdAuth);
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
