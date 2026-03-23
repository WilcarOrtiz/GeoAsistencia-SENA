import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Length, Max, Min } from 'class-validator';

export class CreateClassGroupDto {
  @ApiProperty({ example: 'GR-101' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @Length(2, 10, {
    message: 'El código debe tener entre 2 y 10 caracteres',
  })
  code: string;

  @ApiProperty({ example: 'Grupo A' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 20, {
    message: 'El nombre debe tener entre 3 y 20 caracteres',
  })
  name: string;

  @ApiProperty({ example: 30 })
  @IsNotEmpty({ message: 'El máximo de estudiantes es obligatorio' })
  @IsInt({ message: 'El máximo de estudiantes debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos 1 estudiante' })
  @Max(100, { message: 'No puede exceder 100 estudiantes' })
  max_students: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty({ message: 'El subject_id es obligatorio' })
  @IsUUID('4', { message: 'El subject_id debe ser un UUID válido' })
  subject_id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsNotEmpty({ message: 'El semester_id es obligatorio' })
  @IsUUID('4', { message: 'El semester_id debe ser un UUID válido' })
  semester_id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsNotEmpty({ message: 'El teacher_id es obligatorio' })
  @IsUUID('4', { message: 'El teacher_id debe ser un UUID válido' })
  teacher_id: string;
}
