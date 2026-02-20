import { ClassGroup } from 'src/class_groups/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('CLASS_SESSIONS')
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

  @Column({ type: 'time', nullable: false })
  attendance_closed_at: string;

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
