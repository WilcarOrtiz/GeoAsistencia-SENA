import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StateSemester } from 'src/common/enums/state_semester.enum';

export class ChangeSemesterStateDto {
  @ApiProperty({
    enum: StateSemester,
    enumName: 'StateSemester',
    description: 'Nuevo estado del semestre',
    example: StateSemester.ACTIVE,
  })
  @IsEnum(StateSemester)
  state!: StateSemester;
}
