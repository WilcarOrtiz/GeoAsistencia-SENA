import { Expose, Type } from 'class-transformer';
import { ValidRole } from 'src/common/enums/valid-role.enum';
import { PermissionSimpleResponseDto } from '../../permissions/dto/permission-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoleSimpleResponseDto {
  @ApiProperty({ example: '32189680-8774-4638-8980-304b4f0b2405' })
  @Expose()
  id: string;

  @ApiProperty({ enum: ValidRole, example: ValidRole.STUDENT })
  @Expose()
  name: ValidRole;

  @ApiProperty({ example: 'Rol destinado a los aprendices del SENA' })
  @Expose()
  description: string;

  @Expose()
  @ApiProperty({ example: true })
  is_active: boolean;
}

export class RoleResponseDto extends RoleSimpleResponseDto {
  @ApiProperty({ type: PermissionSimpleResponseDto, isArray: true })
  @Expose()
  @Type(() => PermissionSimpleResponseDto)
  permissions?: PermissionSimpleResponseDto[];
}
