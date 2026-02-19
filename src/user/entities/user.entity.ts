import { Role } from 'src/access-control-module/roles/entities/role.entity';
import { toTitleCase } from 'src/common/utils/string-format.util';
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

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

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

//TODO: EN GEMINI TENGO INFORMACION RESPECTO A LA VALIDACION DE DISPOSITIVO UNICO.
