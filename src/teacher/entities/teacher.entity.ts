import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ClassGroup } from 'src/class_groups/entities';
import { User } from 'src/user/entities/user.entity';

@Entity('TEACHERS')
export class Teacher {
  @PrimaryColumn('uuid')
  auth_id: string;

  @OneToOne(() => User, (user) => user.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auth_id' })
  user: User;

  @Column({ type: 'uuid', unique: true, nullable: true })
  uuid_phone: string;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @OneToMany(() => ClassGroup, (group) => group.teacher)
  classGroups: ClassGroup[];
}
