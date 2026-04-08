import { Role } from 'src/access-control-module/roles/entities/role.entity';
import { ValidRole } from 'src/common/enums/valid-role.enum';
import { toTitleCase } from 'src/common/utils/string-format.util';
import { Student } from 'src/users/student/entities/student.entity';
import { Teacher } from 'src/users/teacher/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  Entity,
  Index,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('USERS')
export class User {
  @PrimaryColumn('uuid')
  auth_id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 11, nullable: false })
  ID_user: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  first_name: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  middle_name?: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  last_name: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  second_last_name?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'auth_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  get fullName(): string {
    return [
      this.first_name,
      this.middle_name,
      this.last_name,
      this.second_last_name,
    ]
      .filter(Boolean)
      .join(' ');
  }

  getValidRoles(): Role[] {
    return this.roles.filter((role) => {
      const name = role.name.toUpperCase() as ValidRole;

      if (name === ValidRole.STUDENT)
        return !!this.student && this.student.is_active;

      if (name === ValidRole.TEACHER)
        return !!this.teacher && this.teacher.is_active;

      return true;
    });
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeNames() {
    if (this.first_name) this.first_name = toTitleCase(this.first_name);
    if (this.middle_name) this.middle_name = toTitleCase(this.middle_name);
    if (this.last_name) this.last_name = toTitleCase(this.last_name);
    if (this.second_last_name)
      this.second_last_name = toTitleCase(this.second_last_name);
  }
}
