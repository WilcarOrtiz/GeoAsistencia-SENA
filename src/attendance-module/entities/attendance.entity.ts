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
import { ClassSessions } from './class-session.entity';
import { Student } from 'src/student/entities/student.entity';
import { AttendanceStatus } from 'src/common/enums/attendance-status.enum';

@Entity('ATTENDANCES')
@Index(['student', 'classSession'], { unique: true })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'time', nullable: true })
  check_in_time: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Student, (student) => student.attendances, {
    nullable: false,
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => ClassSessions, (classSession) => classSession.attendances, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_session_id' })
  classSession: ClassSessions;
}
