import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';
import { StateSemester } from 'src/common/constants/state_semester';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepo: Repository<Semester>,
  ) {}

  private validateTransition(current: StateSemester, next: StateSemester) {
    const validTransitions: Record<StateSemester, StateSemester[]> = {
      [StateSemester.PLANIFICADO]: [
        StateSemester.ACTIVO,
        StateSemester.CANCELADO,
      ],
      [StateSemester.ACTIVO]: [
        StateSemester.FINALIZADO,
        StateSemester.CANCELADO,
      ],
      [StateSemester.FINALIZADO]: [],
      [StateSemester.CANCELADO]: [],
    };

    if (!validTransitions[current].includes(next))
      throw new BadRequestException(
        `No se puede cambiar de ${current} a ${next}`,
      );
  }

  private validateDateRange(start: Date, end: Date) {
    if (start >= end)
      throw new BadRequestException(
        'La fecha de inicio debe ser menor a la de fin',
      );
  }

  private generateAcademicInfo(startDate: Date) {
    const startYear = startDate.getFullYear();
    const term = startDate.getMonth() + 1 <= 6 ? 1 : 2;
    return { startYear, term, code: `${startYear}-${term}` };
  }

  async create(createSemesterDto: CreateSemesterDto) {
    const { start_date, end_date } = createSemesterDto;
    this.validateDateRange(new Date(start_date), new Date(end_date));

    const { startYear, term, code } = this.generateAcademicInfo(
      new Date(start_date),
    );

    const existing = await this.semesterRepo.findOne({
      where: { academic_year: startYear, term },
    });

    if (existing)
      throw new BadRequestException(`Ya existe el semestre ${code}`);

    const semester = this.semesterRepo.create({
      code,
      term,
      academic_year: startYear,
      name: createSemesterDto.name,
      start_date,
      end_date,
      state: createSemesterDto.state,
    });

    return this.semesterRepo.save(semester);
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto) {
    const semester = await this.semesterRepo.findOneBy({ id });

    if (!semester)
      throw new NotFoundException(`Semestre con ${id} no encontrado`);

    const isLocked = [
      StateSemester.FINALIZADO,
      StateSemester.CANCELADO,
    ].includes(semester.state);
    if (isLocked)
      throw new BadRequestException(
        'Semestre cerrado/cancelado no es modificable',
      );

    if (
      semester.state === StateSemester.ACTIVO &&
      (updateSemesterDto.start_date || updateSemesterDto.end_date)
    ) {
      throw new BadRequestException(
        'No se alteran fechas en semestres activos',
      );
    }

    this.validateDateRange(
      updateSemesterDto.start_date
        ? new Date(updateSemesterDto.start_date)
        : semester.start_date,
      updateSemesterDto.end_date
        ? new Date(updateSemesterDto.end_date)
        : semester.end_date,
    );

    return this.semesterRepo.save(Object.assign(semester, updateSemesterDto));
  }

  async changeState(id: string, nextState: StateSemester) {
    const semester = await this.semesterRepo.findOneBy({ id });
    if (!semester) throw new NotFoundException('Semestre no encontrado');
    this.validateTransition(semester.state, nextState);
    semester.state = nextState;
    return this.semesterRepo.save(semester);
  }

  async findOne(term: string) {
    let semester: Semester | null;

    if (isUUID(term)) {
      semester = await this.semesterRepo.findOneBy({ id: term });
    } else {
      const queryBuilder = this.semesterRepo.createQueryBuilder('semester');
      semester = await queryBuilder
        .where('UPPER(semester.code) = :code', {
          code: term.toUpperCase(),
        })
        .orWhere('UPPER(semester.name) = :name', {
          name: term.toUpperCase(),
        })
        .getOne();
    }

    if (!semester)
      throw new NotFoundException(`Semestre with ${term} not found`);

    return semester;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const semester = await this.semesterRepo.find({
      take: limit,
      skip: offset,
    });
    return semester;
  }
}
