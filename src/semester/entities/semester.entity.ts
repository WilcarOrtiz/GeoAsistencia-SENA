import { StateSemester } from 'src/common/constants/state_semester';
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

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'int4' })
  academic_year: number;

  @Column({ type: 'int2' })
  term: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: StateSemester,
  })
  state: StateSemester;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) {
      this.name = this.toTitleCase(this.name.trim());
    }

    if (this.code) {
      this.code = this.code.trim().toUpperCase();
    }
  }

  private toTitleCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
