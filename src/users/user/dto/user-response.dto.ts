import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleListItemDto } from 'src/access-control-module/roles/dto/roles-response.dto';
import { NavigationItemDto } from 'src/access-control-module/menu/dto/navigation-item.dto';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

export class UserBaseResponseDto {
  @ApiProperty({ example: 'b0ac854b-7d66-4e74-a593-e50494161ab0' })
  @Expose()
  auth_id!: string;

  @ApiProperty({ example: '1066865142' })
  @Expose()
  ID_user!: string;

  @ApiProperty({ example: 'correo@email.com' })
  @Expose()
  email!: string;

  @ApiProperty({ example: 'Wilcar' })
  @Expose()
  first_name!: string;

  @ApiProperty({ example: 'Daniel', required: false })
  @Expose()
  middle_name?: string;

  @ApiProperty({ example: 'Ortiz' })
  @Expose()
  last_name!: string;

  @ApiProperty({ example: 'Colpas', required: false })
  @Expose()
  second_last_name?: string;

  @ApiProperty({ example: true })
  @Expose()
  is_active!: boolean;

  @ApiProperty({ example: '2026-03-18T21:43:31.945Z' })
  @Expose()
  created_at!: Date;
}

export class UserResponseWithRolesDto extends UserBaseResponseDto {
  @ApiProperty({ type: RoleListItemDto, isArray: true })
  @Expose()
  @Type(() => RoleListItemDto)
  roles!: RoleListItemDto[];
}

export class PaginatedUserResponseDto extends PaginatedResponseDto<UserResponseWithRolesDto> {
  @Expose()
  @Type(() => UserResponseWithRolesDto)
  @ApiProperty({ type: [UserResponseWithRolesDto] })
  declare data: UserResponseWithRolesDto[];
}

export class UserMeUserDto {
  @ApiProperty({ example: '1066865142' })
  id!: string;

  @ApiProperty({ example: 'b0ac854b-7d66-4e74-a593-e50494161ab0' })
  authId!: string;

  @ApiProperty({ example: 'Wilcar Daniel Ortiz Colpas' })
  fullName!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

export class UserMeResponseDto {
  @ApiProperty({ type: UserMeUserDto })
  @Type(() => UserMeUserDto)
  user!: UserMeUserDto;

  @ApiProperty({ type: [RoleListItemDto] })
  @Type(() => RoleListItemDto)
  roles!: RoleListItemDto[];

  @ApiProperty({ example: ['create:user', 'read:user'], type: [String] })
  permissions!: string[];

  @ApiProperty({ type: () => [NavigationItemDto] })
  @Type(() => NavigationItemDto)
  navigation!: NavigationItemDto[];
}
