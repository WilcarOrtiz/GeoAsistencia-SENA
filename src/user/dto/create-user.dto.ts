import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Daniel', required: false })
  @IsOptional()
  middle_name?: string;

  @ApiProperty({ example: 'Ortiz' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'Colpas', required: false })
  @IsOptional()
  second_last_name?: string;

  @ApiProperty({ example: 'ortizcolpaswilcardaniel@gmail.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Correo electrónico no válido' })
  email: string;

  @ApiProperty({ example: '' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un rol' })
  @IsUUID('4', { each: true, message: 'ID de rol no válido' })
  rolesID: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}
