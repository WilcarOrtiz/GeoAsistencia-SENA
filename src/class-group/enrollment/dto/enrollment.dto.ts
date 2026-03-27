import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class EnrollmentDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un estudiante' })
  @IsNotEmpty()
  @IsUUID('4', { each: true, message: 'El identificador no es válido' })
  students: string[];
}
