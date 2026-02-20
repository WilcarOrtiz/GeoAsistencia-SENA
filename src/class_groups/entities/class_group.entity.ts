import {
  normalizeCode,
  toTitleCase,
} from 'src/common/utils/string-format.util';
import { Semester } from 'src/semester/entities/semester.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ClassDays } from './class_days.entity';
import { ClassSessions } from 'src/attendance-module/entities';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';

@Entity('CLASS_GROUPS')
@Unique(['semester', 'subject', 'name'])
export class ClassGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'citext', unique: true })
  name: string;

  @Column({ type: 'int4' })
  academic_year: number;

  @Column({ type: 'int2', nullable: true })
  max_stidents: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

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

  @ManyToMany(() => Student, (student) => student.groups)
  @JoinTable({
    name: 'ENROLLMENTS',
    joinColumn: { name: 'class_group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'auth_id' },
  })
  students: Student[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) this.name = toTitleCase(this.name);
    if (this.code) this.code = normalizeCode(this.code);
  }
}
