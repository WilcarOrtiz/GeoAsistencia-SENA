import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateClassSessionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsNotEmpty({ message: 'El id del grupo es obligatorio' })
  @IsUUID('4', { message: 'El id del grupo debe ser un UUID válido' })
  group_id!: string;

  @ApiProperty({ example: 'Primer semestre académico 2025' })
  @IsOptional({ message: 'El tema de sesion NO es obligatorio' })
  @Length(3, 30, {
    message: 'El tema de la clase debe tener entre 3 y 30 caracteres',
  })
  class_topic?: string;

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
