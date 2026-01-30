import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('ROLES')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, unique: true, nullable: false })
  name: string;

  @Column({ length: 50, unique: true, nullable: false })
  description: string;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
