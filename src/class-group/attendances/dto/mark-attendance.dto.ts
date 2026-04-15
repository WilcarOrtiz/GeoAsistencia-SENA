import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsNotEmpty({ message: 'El codigo de la clase es obligatorio' })
  @IsUUID('4', { message: 'El id debe ser un UUID válido' })
  student_id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsNotEmpty({ message: 'El codigo de la clase es obligatorio' })
  @IsUUID('4', { message: 'El id debe ser un UUID válido' })
  code_class_session!: string;

  @ApiProperty({
    description: 'Latitud del docente (Ubicacion GPS)',
    example: 10.451718,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({
    description: 'Longitud del docente (Ubicacion GPS)',
    example: -73.274411,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}

//TODO: *SOLO MANEJARE LA ASISTENCIA Y YA, LO DE ACTUALIZACIONES DE ESTADO SE HARA EN UNA VERSION POSTERIOR PERO LOS ENUM YA ESTAN CORRECTO*/
