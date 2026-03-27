import { Exclude } from 'class-transformer';
import { ClassGroup } from 'src/class-group/class-groups/entities/class-group.entity';
import {
  normalizeCode,
  toTitleCase,
} from 'src/common/utils/string-format.util';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('SUBJECTS')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'citext', unique: true })
  code: string;

  @Column({ type: 'citext', unique: true })
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ClassGroup, (classGroup) => classGroup.subject)
  classGroups: ClassGroup[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) this.name = toTitleCase(this.name);
    if (this.code) this.code = normalizeCode(this.code);
  }
}
