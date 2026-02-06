import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRolesUserDto } from './dto/update-roles-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/interface/current-user.interface';

@ApiBearerAuth('access-token')
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

  @Get('me')
  getProfile(@Req() req: Request & { user: CurrentUser }) {
    return this.userService.getUserProfile(req.user.authId);
  }

  @Get()
  findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    return this.userService.findAll(findAllUsersDto);
  }
}
