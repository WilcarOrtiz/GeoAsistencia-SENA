import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class UpdateRolesUserDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un rol' })
  @IsUUID('4', { each: true, message: 'ID de rol no válido' })
  rolesID: string[];
}
