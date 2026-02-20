import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassGroup } from './class_group.entity';
import { getWeekDayLabel, WeekDay } from 'src/common/enums/weeyDay.enum';

@Entity('CLASS_DAYS')
@Index(['classGroup', 'day', 'start_time'], { unique: true })
export class ClassDays {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: WeekDay,
  })
  day: WeekDay;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => ClassGroup, (classGroup) => classGroup.classDays, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_group_id' })
  classGroup: ClassGroup;

  get dayLabel(): string {
    return getWeekDayLabel(this.day);
  }
}
