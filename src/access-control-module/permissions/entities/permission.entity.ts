import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('PERMISSIONS')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, unique: true, nullable: false })
  name: string;

  @Column({ length: 50, unique: true, nullable: false })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
