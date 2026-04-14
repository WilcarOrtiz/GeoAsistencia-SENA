import {
  normalizeCode,
  toTitleCase,
} from 'src/common/utils/string-format.util';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Teacher } from 'src/users/teacher/entities/teacher.entity';
import { Subject } from 'src/academic/subjects/entities/subject.entity';
import { Semester } from 'src/academic/semester/entities/semester.entity';
import { ClassDays } from 'src/class-group/class-days/entities/class-day.entity';
import { ClassSessions } from 'src/class-group/class-sessions/entities/class-session.entity';
import { Exclude } from 'class-transformer';
import { Enrollment } from 'src/class-group/enrollment/entities/enrollment.entity';

@Entity('CLASS_GROUPS')
@Unique(['semester', 'subject', 'name'])
export class ClassGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'citext' })
  name: string;

  @Column({ type: 'int4' })
  academic_year: number;

  @Column({ type: 'int2', nullable: true })
  max_students: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Subject, (subject) => subject.classGroups, {
    nullable: false,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Semester, (semester) => semester.classGroups, {
    nullable: false,
  })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @OneToMany(() => ClassDays, (classDay) => classDay.classGroup)
  classDays: ClassDays[];

  @OneToMany(() => ClassSessions, (classSession) => classSession.classGroup)
  classSessions: ClassSessions[];

  @ManyToOne(() => Teacher, (teacher) => teacher.classGroups, {
    nullable: true,
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.classGroup)
  enrollments: Enrollment[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) this.name = toTitleCase(this.name);
    if (this.code) this.code = normalizeCode(this.code);
  }
}
