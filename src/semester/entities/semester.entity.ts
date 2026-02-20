import { ClassGroup } from 'src/class_groups/entities/class_group.entity';
import { StateSemester } from 'src/common/enums/state_semester.enum';
import {
  normalizeCode,
  toTitleCase,
} from 'src/common/utils/string-format.util';
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';

@Entity('SEMESTERS')
@Check(`"start_date" < "end_date"`)
@Index(['academic_year', 'term'], { unique: true })
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'citext', unique: true })
  name: string;

  @Column({ type: 'int4' })
  academic_year: number;

  @Column({ type: 'int2' })
  term: number;

  @Column({
    type: 'date',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => new Date(value),
    },
  })
  start_date: Date;

  @Column({
    type: 'date',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => new Date(value),
    },
  })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: StateSemester,
    default: StateSemester.ACTIVO,
  })
  state: StateSemester;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ClassGroup, (classGroup) => classGroup.semester)
  classGroups: ClassGroup[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) this.name = toTitleCase(this.name);
    if (this.code) this.code = normalizeCode(this.code);
  }
}
