import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const { name, code } = createSubjectDto;

    const existing = await this.subjectRepo
      .createQueryBuilder('s')
      .where('s.name = :name OR s.code = :code', {
        name,
        code,
      })
      .getOne();

    if (existing) {
      if (existing.code.toUpperCase() === code.toUpperCase()) {
        throw new BadRequestException(
          `El código '${code}' ya está asignado a otra asignatura`,
        );
      }
      throw new BadRequestException(
        `Ya existe una asignatura con el nombre '${name}'`,
      );
    }

    const subject = this.subjectRepo.create(createSubjectDto);
    return await this.subjectRepo.save(subject);
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const { name, code } = updateSubjectDto;

    const subject = await this.subjectRepo.findOneBy({ id });
    if (!subject) throw new NotFoundException(`Asignatura no encontrada`);

    if (name || code) {
      const conflict = await this.subjectRepo
        .createQueryBuilder('s')
        .where('s.id != :id', { id })
        .andWhere('(s.name = :name OR s.code = :code) AND s.is_active = true', {
          name: name || subject.name,
          code: code || subject.code,
        })
        .getOne();

      if (conflict) {
        const isCodeConflict =
          conflict.code.toUpperCase() ===
          (code?.toUpperCase() || subject.code.toUpperCase());
        throw new BadRequestException(
          isCodeConflict
            ? `El código '${code || subject.code}' ya está en uso`
            : `El nombre '${name || subject.name}' ya pertenece a otra asignatura`,
        );
      }
    }

    this.subjectRepo.merge(subject, updateSubjectDto);
    return await this.subjectRepo.save(subject);
  }

  async findOne(term: string) {
    let subject: Subject | null;

    if (isUUID(term)) {
      subject = await this.subjectRepo.findOneBy({ id: term, is_active: true });
    } else {
      subject = await this.subjectRepo
        .createQueryBuilder('s')
        .where('(s.code = :term OR s.name = :term )AND s.is_active = true', {
          term,
        })
        .getOne();
    }

    if (!subject)
      throw new NotFoundException(`Asignatura "${term}" no encontrada`);
    return subject;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.subjectRepo.find({
      take: limit,
      skip: offset,
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  async remove(id: string) {
    const subject = await this.subjectRepo.findOneBy({ id });
    if (!subject) throw new NotFoundException('Asignatura no encontrada');
    subject.is_active = false;
    return this.subjectRepo.save(subject);
  }
}
