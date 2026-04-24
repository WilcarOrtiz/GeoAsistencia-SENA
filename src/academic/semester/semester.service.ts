import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Not, Repository, EntityManager } from 'typeorm';
import { Semester } from './entities/semester.entity';
import { StateSemester } from 'src/common/enums/state_semester.enum';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';
import * as dto from './dto';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepo: Repository<Semester>,
  ) {}

  private validateTransition(current: StateSemester, next: StateSemester) {
    const validTransitions: Record<StateSemester, StateSemester[]> = {
      [StateSemester.PLANNED]: [StateSemester.ACTIVE, StateSemester.CANCELED],
      [StateSemester.ACTIVE]: [StateSemester.FINISHED, StateSemester.CANCELED],
      [StateSemester.FINISHED]: [],
      [StateSemester.CANCELED]: [],
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

  async create(createSemesterDto: dto.CreateSemesterDto): Promise<Semester> {
    const { name, startDate, endDate, state } = createSemesterDto;
    this.validateDateRange(startDate, endDate);
    const { startYear, term, code } = this.generateAcademicInfo(startDate);

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
      name: name,
      end_date: endDate,
      start_date: startDate,
      code,
      term,
      state,
      academic_year: startYear,
    });

    return this.semesterRepo.save(semester);
  }

  async update(
    id: string,
    updateSemesterDto: dto.UpdateSemesterDto,
  ): Promise<Semester> {
    const name = updateSemesterDto.name;
    const start_date = updateSemesterDto.startDate
      ? updateSemesterDto.startDate
      : undefined;

    const end_date = updateSemesterDto.endDate
      ? updateSemesterDto.endDate
      : undefined;

    const semester = await this.semesterRepo.findOneBy({ id });
    if (!semester) throw new NotFoundException(`Semestre no encontrado`);

    if (
      [StateSemester.FINISHED, StateSemester.CANCELED].includes(semester.state)
    ) {
      throw new BadRequestException(
        'No se puede modificar un semestre finalizado o cancelado',
      );
    }

    if (semester.state === StateSemester.ACTIVE && (start_date || end_date)) {
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

    this.semesterRepo.merge(
      semester,
      {
        name: updateSemesterDto.name,
        start_date: updateSemesterDto.startDate,
        end_date: updateSemesterDto.endDate,
      },
      academicUpdates,
    );
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

  async findActiveOrPlanned(id: string): Promise<Semester> {
    const semester = await this.semesterRepo.findOne({
      where: {
        id,
        is_active: true,
        state: In([StateSemester.ACTIVE, StateSemester.PLANNED]),
      },
    });

    if (!semester) {
      throw new BadRequestException(
        'El semestre no existe o no está en un estado válido para asignar grupos',
      );
    }

    return semester;
  }

  async findAll(
    options: dto.FindAllSemesterDto,
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
    const semester = await this.semesterRepo.findOne({
      where: { id },
      relations: { classGroups: true },
    });

    if (!semester) throw new NotFoundException('Semestre no encontrado');

    if (semester.classGroups.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el semestre porque tiene grupos de clase asociados',
      );
    }

    semester.is_active = false;
    await this.semesterRepo.save(semester);
    return { message: 'Semestre eliminado correctamente' };
  }

  async findAllForSelect(type: 'select' | 'filter'): Promise<Semester[]> {
    const where =
      type === 'select'
        ? {
            is_active: true,
            state: In([StateSemester.ACTIVE, StateSemester.PLANNED]),
          }
        : {};

    return await this.semesterRepo.find({
      where,
      order: { start_date: 'DESC' },
      select: ['id', 'name', 'code'],
    });
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Semester);
    await repo.createQueryBuilder().delete().execute();
  }
}
