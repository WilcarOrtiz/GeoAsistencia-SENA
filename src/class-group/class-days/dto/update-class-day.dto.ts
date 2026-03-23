import { PartialType } from '@nestjs/swagger';
import { CreateClassDayDto } from './create-class-day.dto';

export class UpdateClassDayDto extends PartialType(CreateClassDayDto) {}
