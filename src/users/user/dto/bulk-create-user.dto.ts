import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ROLE_SYSTEM_KEYS } from 'src/common/enums/valid-role.enum';

export class BulkUserRowDto {
  @ApiProperty({ example: '1066865142' })
  @IsNotEmpty({ message: 'La identificación es obligatoria' })
  @IsNumberString(
    {},
    { message: 'La identificación debe contener solo números' },
  )
  @Length(8, 11, {
    message: 'La identificación debe tener entre 8 y 11 dígitos',
  })
  ID!: string;

  @ApiProperty({ example: 'Wilcar' })
  @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
  @Length(1, 15)
  first_name!: string;

  @ApiProperty({ example: 'Daniel', required: false })
  @IsOptional()
  @Length(1, 15)
  middle_name?: string;

  @ApiProperty({ example: 'Ortiz' })
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  @Length(1, 15)
  last_name!: string;

  @ApiProperty({ example: 'Colpas', required: false })
  @IsOptional()
  @Length(1, 15)
  second_last_name?: string;

  @ApiProperty({ example: 'wilcar@sena.edu.co' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'Correo electrónico no válido' })
  email!: string;

  @ApiProperty({
    example: 'TEACHER',
    description: `Nombre(s) de rol separados por coma. Valores válidos: ${ROLE_SYSTEM_KEYS.join(', ')}`,
  })
  @IsArray({ message: 'roles debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'Debes indicar al menos un rol' })
  @IsString({ each: true })
  @IsIn(ROLE_SYSTEM_KEYS, {
    each: true,
    message: `Cada rol debe ser uno de: ${ROLE_SYSTEM_KEYS.join(', ')}`,
  })
  roles!: string[];
}

export class BulkCreateUsersDto {
  @ApiProperty({ type: [BulkUserRowDto] })
  @IsArray()
  @ArrayNotEmpty({ message: 'El archivo no contiene filas válidas' })
  @ValidateNested({ each: true })
  @Type(() => BulkUserRowDto)
  users!: BulkUserRowDto[];
}
