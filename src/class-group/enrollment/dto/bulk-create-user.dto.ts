import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
export class BulkEnrollmentRowDto {
  @ApiProperty({ example: '1066865142' })
  @IsNotEmpty({ message: 'La identificación es obligatoria' })
  @IsNumberString(
    {},
    { message: 'La identificación debe contener solo números' },
  )
  @Length(8, 11, {
    message: 'La identificación debe tener entre 8 y 11 dígitos',
  })
  ID!: string;
}
