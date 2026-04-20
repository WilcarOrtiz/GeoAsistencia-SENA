import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateClassGroupDto } from './create-class-group.dto';

export class UpdateClassGroupDto extends PartialType(
  OmitType(CreateClassGroupDto, ['subject_id', 'semester_id'] as const),
) {}
