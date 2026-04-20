import { Expose } from 'class-transformer';
import { WeekDay } from 'src/common/enums/weeyDay.enum';

export class ClassDayResponseDto {
  @Expose()
  id!: string;

  @Expose()
  is_active!: boolean;

  @Expose()
  start_time!: string;

  @Expose()
  end_time!: string;

  @Expose()
  created_at!: Date;

  @Expose()
  day!: WeekDay;
}
