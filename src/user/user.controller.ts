import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRolesUserDto } from './dto/update-roles-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id/roles')
  updateUserRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolesUserDto: UpdateRolesUserDto,
  ) {
    return this.userService.updateRoles(id, updateRolesUserDto);
  }

  @Get()
  findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    /*endpoin para obtener todos los usuarios o por rolId  */
    return this.userService.findAll(findAllUsersDto);
  }
}
