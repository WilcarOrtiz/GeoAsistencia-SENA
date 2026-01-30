import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class UpdateRolePermissions {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un permiso' })
  @IsUUID('4', { each: true, message: 'ID de permiso no válido' })
  permissionIds: string[];
}
