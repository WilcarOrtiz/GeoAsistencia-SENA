import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '1066865142' })
  @IsNotEmpty()
  @IsNumberString(
    {},
    { message: 'La identificación debe contener solo números' },
  )
  @Length(8, 11, {
    message: 'La identificación debe tener entre 8 y 11 dígitos',
  })
  ID: string;

  @ApiProperty({ example: 'Wilcar' })
  @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
  @Length(1, 15, {
    message: 'El nombre debe tener entre 1 y 15 caracteres',
  })
  first_name: string;

  @ApiProperty({ example: 'Daniel', required: false })
  @IsOptional()
  @Length(1, 15, {
    message: 'El segundo nombre debe tener entre 1 y 15 caracteres',
  })
  middle_name?: string;

  @ApiProperty({ example: 'Ortiz' })
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  @Length(1, 15, {
    message: 'El primer apellido debe tener entre 1 y 15 caracteres',
  })
  last_name: string;

  @ApiProperty({ example: 'Colpas', required: false })
  @IsOptional()
  @Length(1, 15, {
    message: 'El segundo apellido debe tener entre 1 y 15 caracteres',
  })
  second_last_name?: string;

  @ApiProperty({ example: 'ortizcolpaswilcardaniel@gmail.com' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'Correo electrónico no válido' })
  email: string;

  @ApiProperty({})
  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un rol' })
  @IsUUID('4', { each: true, message: 'ID de rol no válido' })
  rolesID: string[];
}
