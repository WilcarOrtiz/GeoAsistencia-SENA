import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleSimpleResponseDto } from 'src/access-control-module/roles/dto/roles-response.dto';

export class PermissionSimpleResponseDto {
  @ApiProperty({ example: '7d2e3450-e29b-41d4-a716-446655440000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'CREATE_USER' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Permite crear nuevos usuarios en el sistema' })
  @Expose()
  description: string;
}

export class PermissionResponseDto extends PermissionSimpleResponseDto {
  @ApiProperty({
    type: () => RoleSimpleResponseDto,
    isArray: true,
    description: 'Lista de roles que tienen asignado este permiso',
  })
  @Expose()
  @Type(() => RoleSimpleResponseDto)
  roles?: RoleSimpleResponseDto[];
}
