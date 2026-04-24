import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { isUUID } from 'class-validator';
import {
  PaginatedResponseDto,
  PaginationDto,
} from 'src/common/dtos/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  private async findByIdOrFail(id: string): Promise<Subject> {
    const subject = await this.subjectRepo.findOneBy({ id });
    if (!subject) throw new NotFoundException('Asignatura no encontrada');
    return subject;
  }

  private async assertNoDuplicate(
    name: string,
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const qb = this.subjectRepo
      .createQueryBuilder('s')
      .where('(s.name = :name OR s.code = :code) AND s.is_active = true', {
        name,
        code,
      });

    if (excludeId) qb.andWhere('s.id != :excludeId', { excludeId });

    const conflict = await qb.getOne();
    if (!conflict) return;

    if (conflict.code.toUpperCase() === code.toUpperCase())
      throw new BadRequestException(`El código '${code}' ya está en uso`);

    throw new BadRequestException(
      `Ya existe una asignatura con el nombre '${name}'`,
    );
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const { name, code } = createSubjectDto;
    await this.assertNoDuplicate(name, code);
    const subject = this.subjectRepo.create(createSubjectDto);
    return this.subjectRepo.save(subject);
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findByIdOrFail(id);

    if (updateSubjectDto.name || updateSubjectDto.code) {
      const name = updateSubjectDto.name ?? subject.name;
      const code = updateSubjectDto.code ?? subject.code;
      await this.assertNoDuplicate(name, code, id);
    }

    this.subjectRepo.merge(subject, updateSubjectDto);
    return this.subjectRepo.save(subject);
  }

  async findAll(
    options: PaginationDto,
  ): Promise<PaginatedResponseDto<Subject>> {
    const { limit = 10, page = 1 } = options;

    const offset = (page - 1) * limit;

    const [data, total] = await this.subjectRepo.findAndCount({
      where: {
        is_active: true,
      },
      order: { created_at: 'ASC' },
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

  async findOne(term: string): Promise<Subject> {
    const subject = isUUID(term)
      ? await this.subjectRepo.findOneBy({ id: term, is_active: true })
      : await this.subjectRepo
          .createQueryBuilder('s')
          .where('(s.code = :term OR s.name = :term) AND s.is_active = true', {
            term,
          })
          .getOne();

    if (!subject)
      throw new NotFoundException(`Asignatura "${term}" no encontrada`);
    return subject;
  }

  async remove(id: string): Promise<{ message: string }> {
    const subject = await this.findByIdOrFail(id);
    subject.is_active = false;
    await this.subjectRepo.save(subject);
    return { message: 'Asignatura desactivada correctamente' };
  }

  async findAllForSelect(): Promise<Subject[]> {
    return await this.subjectRepo.find({
      where: {
        is_active: true,
      },
      order: {
        name: 'ASC',
      },
      select: ['id', 'name', 'code'],
    });
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Subject);
    await repo.createQueryBuilder().delete().execute();
  }
}
