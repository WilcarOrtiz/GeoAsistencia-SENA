import { ClassGroup } from 'src/class-group/class-groups/entities/class-group.entity';
import { EnrollmentStatus } from 'src/common/enums/enrollment-status.enum';
import { Student } from 'src/users/student/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ENROLLMENTS')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status!: EnrollmentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  enrolled_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  unenrolled_at!: Date;

  @ManyToOne(() => ClassGroup, (group) => group.enrollments, {
    nullable: false,
  })
  @JoinColumn({ name: 'class_group_id' })
  classGroup!: ClassGroup;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
  })
  @JoinColumn({ name: 'student_id' })
  student!: Student;
}
