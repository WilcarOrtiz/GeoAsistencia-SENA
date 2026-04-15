import { Expose, Type } from 'class-transformer';
import { ValidRole } from 'src/common/enums/valid-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

export class RoleListItemDto {
  @ApiProperty({ example: '32189680-8774-4638-8980-304b4f0b2405' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: ValidRole, example: ValidRole.STUDENT })
  @Expose()
  name!: ValidRole;
}

export class RoleResponseDto {
  @ApiProperty({ example: '32189680-8774-4638-8980-304b4f0b2405' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: ValidRole, example: ValidRole.STUDENT })
  @Expose()
  name!: ValidRole;

  @ApiProperty({ example: 'Rol destinado a los aprendices del SENA' })
  @Expose()
  description!: string;

  @Expose()
  @ApiProperty({ example: true })
  is_active!: boolean;
}

export class PaginatedRoleResponseDto extends PaginatedResponseDto<RoleResponseDto> {
  @Expose()
  @Type(() => RoleResponseDto)
  @ApiProperty({ type: [RoleResponseDto] })
  declare data: RoleResponseDto[];
}
