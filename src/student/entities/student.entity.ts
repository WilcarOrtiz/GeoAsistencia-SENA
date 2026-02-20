import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Attendance } from 'src/attendance-module/entities';
import { ClassGroup } from 'src/class_groups/entities';
import { User } from 'src/user/entities/user.entity';

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
