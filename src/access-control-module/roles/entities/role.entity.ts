import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { ValidRole } from 'src/common/enums/valid-role.enum';

@Entity('ROLES')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ValidRole,
    unique: true,
    nullable: false,
  })
  name: ValidRole;

  @Column({ length: 50, unique: true, nullable: false })
  description: string;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'RESTRICT',
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

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
