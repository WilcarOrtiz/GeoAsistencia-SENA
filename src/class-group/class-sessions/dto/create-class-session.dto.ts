import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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

  @IsOptional()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (value === null ? undefined : value))
  @Length(3, 30)
  class_topic?: string;

  @ApiProperty({
    description: 'Latitud del docente (Ubicacion GPS)',
    example: 10.451718,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({
    description: 'Longitud del docente (Ubicacion GPS)',
    example: -73.274411,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(-180)
  @Max(180)
  longitude!: number;
}
