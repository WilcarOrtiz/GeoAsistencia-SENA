import { Permission } from 'src/access-control-module/permissions/entities/permission.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('MENU_ITEMS')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  order_index: number;

  @ManyToOne(() => Permission, { nullable: true })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  // --- RELACIÓN PADRE e HIJO (Auto-relación) ---

  @Column({ nullable: true })
  parent_id: string;

  // El "Padre": Muchos ítems pueden pertenecer a un mismo padre
  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  // Los "Hijos": Un ítem puede tener una lista de sub-ítems
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];
}
