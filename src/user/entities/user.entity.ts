import { Role } from 'src/access-control-module/roles/role.entity';
import {
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  Entity,
  Index,
  PrimaryColumn,
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
  middle_name: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  last_name: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  second_last_name: string;

  @Column({ type: 'uuid', nullable: true })
  uuid_phone: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
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

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

//TODO: EN GEMINI TENGO INFORMACION RESPECTO A LA VALIDACION DE DISPOSITIVO UNICO.
