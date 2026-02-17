import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StateSemester } from 'src/common/constants/state_semester';

export class ChangeSemesterStateDto {
  @ApiProperty({
    enum: StateSemester,
    enumName: 'StateSemester', // Esto crea una referencia global en Swagger
    description: 'Estado actual del semestre',
    example: StateSemester.ACTIVO, // Ayuda a que Swagger sepa qué mostrar por defecto
  })
  @IsEnum(StateSemester)
  state: StateSemester;
}
