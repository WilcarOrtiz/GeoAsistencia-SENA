import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class BulkSubjectRowDto {
  @ApiProperty({ example: 'PRO234' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString()
  @Length(3, 10, { message: 'El código debe tener entre 3 y 10 caracteres' })
  code!: string;

  @ApiProperty({ example: 'Programacion II' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Length(3, 30, { message: 'El nombre debe tener entre 3 y 30 caracteres' })
  name!: string;
}
