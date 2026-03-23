import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Programacion II' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 30, {
    message: 'El nombre debe tener entre 3 y 30 caracteres',
  })
  name: string;

  @ApiProperty({ example: 'PRO234' })
  @IsNotEmpty({ message: 'El codigo es obligatorio' })
  @Length(3, 10, {
    message: 'El codigo debe tener entre 3 y 10 caracteres',
  })
  code: string;
}
