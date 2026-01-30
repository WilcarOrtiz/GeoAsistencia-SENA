import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  ID: string;

  @ApiProperty()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  middle_name: string;

  @ApiProperty()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  second_last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un rol' })
  @IsUUID('4', { each: true, message: 'ID de rol no válido' })
  rolesID: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}
