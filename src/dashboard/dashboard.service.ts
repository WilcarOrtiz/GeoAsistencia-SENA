import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AdminFilterDto } from './dto/admin-filters.dto';
import { TeacherFilterDto } from './dto/teacher-filters.dto';
import { SupabaseAdminService } from 'src/supabase/supabase-admin/supabase-admin.service';
import {
  AdminGroupAttendance,
  AdminStudentAbsence,
  AttendanceDistribution,
  DashboardOverview,
  SubjectRanking,
  TeacherGroupAttendance,
  TeacherGroupRanking,
  TeacherStudentAbsence,
} from './interface/dashboard.interfaces';
import {
  CACHE_SERVICE,
  CacheModules,
  CacheTTLTimes,
} from 'src/common/cache/cache.constants';
import type { ICacheService } from 'src/common/cache/cache.interface';
import { CacheKeyFactory } from 'src/common/cache/cache-key.factory';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly supabaseAdmin: SupabaseAdminService,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
  ) {}

  // ─── Helpers privados ────────────────────────────────────────────────────
  private async rpc<T>(
    fnName: string,
    params: Record<string, unknown>,
    errorContext: string,
  ): Promise<T[]> {
    const response = await this.supabaseAdmin.client.rpc(fnName, params);
    if (response.error) {
      this.logger.error(errorContext, response.error);
      throw new InternalServerErrorException(response.error.message);
    }
    return (response.data as T[] | null) ?? [];
  }

  private key(action: string, params?: Record<string, unknown>): string {
    return CacheKeyFactory.build(CacheModules.DASHBOARD, action, params);
  }

  // ─── Teacher endpoints ───────────────────────────────────────────────────

  async teacherOverview(teacherId: string): Promise<DashboardOverview> {
    const cacheKey = this.key('teacher-overview', { teacherId });
    const cached = await this.cache.get<DashboardOverview>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<DashboardOverview>(
      'teacher_overview',
      { p_teacher_id: teacherId },
      'teacherOverview',
    );

    if (!data.length) {
      throw new InternalServerErrorException(
        'No se encontró información del dashboard',
      );
    }

    await this.cache.set(cacheKey, data[0], CacheTTLTimes.DASHBOARD);
    return data[0];
  }

  async teacherAttendance(
    teacherId: string,
  ): Promise<TeacherGroupAttendance[]> {
    const cacheKey = this.key('teacher-attendance', { teacherId });
    const cached = await this.cache.get<TeacherGroupAttendance[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<TeacherGroupAttendance>(
      'teacher_attendance_by_group',
      { p_teacher_id: teacherId },
      'teacherAttendance',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  async teacherDistribution(
    teacherId: string,
  ): Promise<AttendanceDistribution[]> {
    const cacheKey = this.key('teacher-distribution', { teacherId });
    const cached = await this.cache.get<AttendanceDistribution[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<AttendanceDistribution>(
      'teacher_attendance_distribution',
      { p_teacher_id: teacherId },
      'teacherDistribution',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  async teacherGroupsRanking(
    teacherId: string,
    filters: TeacherFilterDto,
  ): Promise<TeacherGroupRanking[]> {
    const cacheKey = this.key('teacher-groups-ranking', {
      teacherId,
      limit: filters.limit ?? 10,
    });
    const cached = await this.cache.get<TeacherGroupRanking[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<TeacherGroupRanking>(
      'teacher_groups_ranking',
      { p_teacher_id: teacherId, p_limit: filters.limit ?? 10 },
      'teacherGroupsRanking',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  async teacherStudentsAbsences(
    teacherId: string,
    filters: TeacherFilterDto,
  ): Promise<TeacherStudentAbsence[]> {
    const cacheKey = this.key('teacher-students-absences', {
      teacherId,
      limit: filters.limit ?? 10,
    });
    const cached = await this.cache.get<TeacherStudentAbsence[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<TeacherStudentAbsence>(
      'teacher_students_absences',
      { p_teacher_id: teacherId, p_limit: filters.limit ?? 10 },
      'teacherStudentsAbsences',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  // ─── Admin endpoints ─────────────────────────────────────────────────────

  async adminOverview(filters: AdminFilterDto): Promise<DashboardOverview> {
    const cacheKey = this.key('admin-overview', {
      semesterId: filters.semesterId,
      teacherId: filters.teacherId,
      subjectId: filters.subjectId,
    });
    const cached = await this.cache.get<DashboardOverview>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<DashboardOverview>(
      'admin_overview',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
      },
      'adminOverview',
    );

    if (!data.length) {
      throw new InternalServerErrorException(
        'No se encontró información del dashboard',
      );
    }

    await this.cache.set(cacheKey, data[0], CacheTTLTimes.DASHBOARD);
    return data[0];
  }

  async adminAttendance(
    filters: AdminFilterDto,
  ): Promise<AdminGroupAttendance[]> {
    const cacheKey = this.key('admin-attendance', {
      semesterId: filters.semesterId,
      teacherId: filters.teacherId,
      subjectId: filters.subjectId,
    });
    const cached = await this.cache.get<AdminGroupAttendance[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<AdminGroupAttendance>(
      'admin_attendance_by_group',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
      },
      'adminAttendance',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  async adminDistribution(
    filters: AdminFilterDto,
  ): Promise<AttendanceDistribution[]> {
    const cacheKey = this.key('admin-distribution', {
      semesterId: filters.semesterId,
      teacherId: filters.teacherId,
      subjectId: filters.subjectId,
    });
    const cached = await this.cache.get<AttendanceDistribution[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<AttendanceDistribution>(
      'admin_attendance_distribution',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
      },
      'adminDistribution',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  async adminSubjectsRanking(
    filters: AdminFilterDto,
  ): Promise<SubjectRanking[]> {
    const cacheKey = this.key('admin-subjects-ranking', {
      semesterId: filters.semesterId,
      teacherId: filters.teacherId,
      subjectId: filters.subjectId,
      limit: filters.limit ?? 10,
    });
    const cached = await this.cache.get<SubjectRanking[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<SubjectRanking>(
      'admin_subjects_ranking',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
        p_limit: filters.limit ?? 10,
      },
      'adminSubjectsRanking',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  async adminStudentsAbsences(
    filters: AdminFilterDto,
  ): Promise<AdminStudentAbsence[]> {
    const cacheKey = this.key('admin-students-absences', {
      semesterId: filters.semesterId,
      teacherId: filters.teacherId,
      subjectId: filters.subjectId,
      limit: filters.limit ?? 10,
    });
    const cached = await this.cache.get<AdminStudentAbsence[]>(cacheKey);
    if (cached) return cached;

    const data = await this.rpc<AdminStudentAbsence>(
      'admin_students_absences',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
        p_limit: filters.limit ?? 10,
      },
      'adminStudentsAbsences',
    );

    await this.cache.set(cacheKey, data, CacheTTLTimes.DASHBOARD);
    return data;
  }

  // ─── Invalidación ────────────────────────────────────────────────────────
  async invalidateDashboard(): Promise<void> {
    await this.cache.delByPrefix(CacheModules.DASHBOARD);
  }
}
