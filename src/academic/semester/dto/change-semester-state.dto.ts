import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StateSemester } from 'src/common/enums/state_semester.enum';

export class ChangeSemesterStateDto {
  @ApiProperty({
    enum: StateSemester,
    enumName: 'StateSemester',
    description: 'Estado actual del semestre',
    example: StateSemester.ACTIVO,
  })
  @IsEnum(StateSemester)
  state: StateSemester;
}
