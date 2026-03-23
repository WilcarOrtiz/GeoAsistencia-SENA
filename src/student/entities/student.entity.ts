import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Attendance } from 'src/class-group/attendances/entities/attendance.entity';
import { ClassGroup } from 'src/class-group/class-groups/entities/class-group.entity';

@Entity('STUDENTS')
export class Student {
  @PrimaryColumn('uuid')
  auth_id: string;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auth_id' })
  user: User;

  @Column({ type: 'uuid', unique: true, nullable: true })
  uuid_phone: string;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @ManyToMany(() => ClassGroup, (group) => group.students)
  groups: ClassGroup[];
}
