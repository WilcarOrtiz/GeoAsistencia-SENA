import { Permission } from 'src/access-control-module/permissions/entities/permission.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('MENU_ITEMS')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'citext', nullable: false })
  name!: string;

  @Column({ nullable: true })
  route!: string;

  @Column({ nullable: true })
  icon!: string;

  @Column({ default: 0 })
  order_index!: number;

  @ManyToOne(() => Permission, { nullable: true })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;

  @Index()
  @Column({ nullable: true })
  parent_id!: string;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'parent_id' })
  parent!: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children!: Menu[];
}
