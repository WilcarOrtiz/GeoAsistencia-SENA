import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';
import { StateSemester } from 'src/common/enums/state_semester.enum';
import { isUUID } from 'class-validator';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';
import {
  CreateSemesterDto,
  FindAllSemesterDto,
  UpdateSemesterDto,
} from './dto';

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

    if (!validTransitions[current].includes(next)) {
      throw new BadRequestException(
        `No se puede cambiar de ${current} a ${next}`,
      );
    }
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

  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    const { name, start_date, end_date } = createSemesterDto;
    this.validateDateRange(start_date, end_date);
    const { startYear, term, code } = this.generateAcademicInfo(start_date);

    const existing = await this.semesterRepo.findOne({
      where: [
        {
          academic_year: startYear,
          term: term,
        },
        {
          name: ILike(name),
        },
      ],
    });

    if (existing) {
      const isSamePeriod =
        existing.academic_year === startYear && existing.term === term;
      throw new BadRequestException(
        isSamePeriod
          ? `Ya existe un semestre para el periodo ${code}`
          : `El nombre "${name}" ya está en uso`,
      );
    }

    const semester = this.semesterRepo.create({
      ...createSemesterDto,
      code,
      term,
      academic_year: startYear,
    });

    return this.semesterRepo.save(semester);
  }

  async update(
    id: string,
    updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    const name = updateSemesterDto.name;
    const start_date = updateSemesterDto.start_date
      ? updateSemesterDto.start_date
      : undefined;

    const end_date = updateSemesterDto.end_date
      ? updateSemesterDto.end_date
      : undefined;

    const semester = await this.semesterRepo.findOneBy({ id });
    if (!semester) throw new NotFoundException(`Semestre no encontrado`);

    if (
      [StateSemester.FINALIZADO, StateSemester.CANCELADO].includes(
        semester.state,
      )
    ) {
      throw new BadRequestException(
        'No se puede modificar un semestre finalizado o cancelado',
      );
    }

    if (semester.state === StateSemester.ACTIVO && (start_date || end_date)) {
      throw new BadRequestException(
        'No se permite cambiar fechas de un semestre en curso',
      );
    }

    const finalStartDate = start_date ? start_date : semester.start_date;
    const finalEndDate = end_date ? end_date : semester.end_date;
    this.validateDateRange(finalStartDate, finalEndDate);

    let academicUpdates = {};

    if (name || start_date) {
      const { startYear, term, code } =
        this.generateAcademicInfo(finalStartDate);
      const newName = name || semester.name;

      const conflict = await this.semesterRepo.findOne({
        where: [
          {
            id: Not(id),
            academic_year: startYear,
            term: term,
          },
          {
            id: Not(id),
            name: ILike(newName),
          },
        ],
      });

      if (conflict) {
        const isSamePeriod =
          conflict.academic_year === startYear && conflict.term === term;
        throw new BadRequestException(
          isSamePeriod
            ? `Conflicto: El periodo ${code} ya está registrado en otro semestre`
            : `Conflicto: El nombre "${newName}" ya pertenece a otro registro`,
        );
      }

      if (start_date)
        academicUpdates = { academic_year: startYear, term, code };
    }

    this.semesterRepo.merge(semester, updateSemesterDto, academicUpdates);
    return await this.semesterRepo.save(semester);
  }

  async changeState(
    id: string,
    nextState: StateSemester,
  ): Promise<{ state: StateSemester }> {
    const semester = await this.semesterRepo.findOneBy({ id });
    if (!semester) throw new NotFoundException('Semestre no encontrado');
    this.validateTransition(semester.state, nextState);

    semester.state = nextState;
    await this.semesterRepo.save(semester);

    return { state: nextState };
  }

  async findOne(term_param: string): Promise<Semester> {
    const term = decodeURIComponent(term_param).trim();
    let semester: Semester | null;

    if (isUUID(term)) {
      semester = await this.semesterRepo.findOne({
        where: { id: term, is_active: true },
      });
    } else {
      semester = await this.semesterRepo
        .createQueryBuilder('semester')
        .where('semester.is_active = true')
        .andWhere(
          `(
          unaccent(lower(semester.code)) = unaccent(lower(:term))
          OR
          unaccent(lower(semester.name)) = unaccent(lower(:term))
          )`,
          { term },
        )
        .getOne();
    }

    if (!semester)
      throw new NotFoundException(`Semestre with ${term} not found`);
    return semester;
  }

  async findAll(
    options: FindAllSemesterDto,
  ): Promise<PaginatedResponseDto<Semester>> {
    const { limit = 10, page = 1, state } = options;

    const offset = (page - 1) * limit;

    const [data, total] = await this.semesterRepo.findAndCount({
      where: {
        is_active: true,
        ...(state ? { state } : {}),
      },
      order: { start_date: 'ASC' },
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
      limit,
      page,
    };
  }
  async remove(id: string): Promise<{ message: string }> {
    const semester = await this.semesterRepo.findOneBy({ id });
    if (!semester) throw new NotFoundException('Semestre no encontrado');
    semester.is_active = false;
    await this.semesterRepo.save(semester);
    return { message: 'Semestre eliminado correctamente' };
  }
}
