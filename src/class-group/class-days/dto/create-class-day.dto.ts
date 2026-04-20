import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsUUID, Matches } from 'class-validator';
import { WeekDay } from 'src/common/enums/weeyDay.enum';

export class CreateClassDayDto {
  @ApiProperty({ example: '08:00' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio debe tener formato HH:mm',
  })
  start_time!: string;

  @ApiProperty({ example: '10:00' })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de fin debe tener formato HH:mm',
  })
  end_time!: string;

  @ApiProperty({
    enum: WeekDay,
    isArray: true,
    example: [WeekDay.MONDAY, WeekDay.WEDNESDAY],
  })
  @IsArray({ message: 'Los días deben ser un arreglo' })
  @IsEnum(WeekDay, {
    message: 'Alguno de los días no es válido',
    each: true,
  })
  days!: WeekDay[];

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsNotEmpty({ message: 'El ID del grupo de clase es obligatorio' })
  @IsUUID('4', { message: 'El ID del grupo debe ser un UUID válido' })
  classGroup_id!: string;
}
