import { Attendance } from 'src/class-group/attendances/entities/attendance.entity';
import { ClassGroup } from 'src/class-group/class-groups/entities/class-group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('CLASS_SESSIONS')
@Index(['code_class_session'])
export class ClassSessions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  class_topic: string;

  @Column({ type: 'uuid', nullable: false })
  code_class_session: string;

  @Column({ type: 'bool', default: true })
  can_mark_attendance: boolean;

  @Column({ type: 'time', nullable: false })
  attendance_opened_at: string;

  @Column({ type: 'time', nullable: true })
  attendance_closed_at: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  teacher_latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  teacher_longitude: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => ClassGroup, (classGroup) => classGroup.classSessions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_group_id' })
  classGroup: ClassGroup;

  @OneToMany(() => Attendance, (attendance) => attendance.classSession)
  attendances: Attendance[];
}
