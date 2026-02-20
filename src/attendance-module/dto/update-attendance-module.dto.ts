import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceModuleDto } from './create-attendance-module.dto';

export class UpdateAttendanceModuleDto extends PartialType(CreateAttendanceModuleDto) {}
