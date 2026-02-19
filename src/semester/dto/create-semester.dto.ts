import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { StateSemester } from 'src/common/constants/state_semester';

export class CreateSemesterDto {
  @ApiProperty({ example: 'Primer semestre académico 2025' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 30, {
    message: 'El nombre debe tener entre 3 y 30 caracteres',
  })
  name: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio no es válida' })
  start_date: Date;

  @ApiProperty({ example: '2025-06-30' })
  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de finalización no es válida' })
  end_date: Date;

  @ApiProperty({
    enum: StateSemester,
    example: StateSemester.ACTIVO,
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(StateSemester, {
    message: 'El estado del semestre no es válido',
  })
  state: StateSemester;
}
