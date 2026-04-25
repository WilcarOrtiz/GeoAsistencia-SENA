import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { EnrollmentDto } from './enrollment.dto';

export class MoveEnrollmentDto extends EnrollmentDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsNotEmpty()
  @IsUUID('4', { message: 'Grupo origen inválido' })
  fromGroupId!: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsNotEmpty()
  @IsUUID('4', { message: 'Grupo destino inválido' })
  toGroupId!: string;
}

export class removeEnrollmentDto extends EnrollmentDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsNotEmpty()
  @IsUUID('4', { message: 'Grupo destino inválido' })
  toGroupId!: string;
}
