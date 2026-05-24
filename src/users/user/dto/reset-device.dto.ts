import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ResetDevicesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  userIds!: string[];
}
