import {
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
  TeacherStudentAbsence,
} from './interface/dashboard.interfaces';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(private readonly supabaseAdmin: SupabaseAdminService) {}

  async teacherAttendance(
    teacherId: string,
  ): Promise<TeacherGroupAttendance[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'teacher_attendance_by_group',
      { p_teacher_id: teacherId },
    );
    if (error) {
      this.logger.error('teacherAttendance', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async adminAttendance(
    filters: AdminFilterDto,
  ): Promise<AdminGroupAttendance[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'admin_attendance_by_group',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
      },
    );
    if (error) {
      this.logger.error('adminAttendance', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async teacherOverview(teacherId: string): Promise<DashboardOverview> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'teacher_overview',
      { p_teacher_id: teacherId },
    );
    if (error) {
      this.logger.error('teacherOverview', error);
      throw new InternalServerErrorException(error.message);
    }
    return data[0] as DashboardOverview;
  }

  async adminOverview(filters: AdminFilterDto): Promise<DashboardOverview> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'admin_overview',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
      },
    );
    if (error) {
      this.logger.error('adminOverview', error);
      throw new InternalServerErrorException(error.message);
    }
    return data[0] as DashboardOverview;
  }

  async teacherDistribution(
    teacherId: string,
  ): Promise<AttendanceDistribution[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'teacher_attendance_distribution',
      { p_teacher_id: teacherId },
    );
    if (error) {
      this.logger.error('teacherDistribution', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async adminDistribution(
    filters: AdminFilterDto,
  ): Promise<AttendanceDistribution[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'admin_attendance_distribution',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
      },
    );
    if (error) {
      this.logger.error('adminDistribution', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async adminSubjectsRanking(
    filters: AdminFilterDto,
  ): Promise<SubjectRanking[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'admin_subjects_ranking',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
        p_limit: filters.limit ?? 10,
      },
    );
    if (error) {
      this.logger.error('adminSubjectsRanking', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async teacherStudentsAbsences(
    teacherId: string,
    filters: TeacherFilterDto,
  ): Promise<TeacherStudentAbsence[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'teacher_students_absences',
      {
        p_teacher_id: teacherId,
        p_limit: filters.limit ?? 10,
      },
    );
    if (error) {
      this.logger.error('teacherStudentsAbsences', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async adminStudentsAbsences(
    filters: AdminFilterDto,
  ): Promise<AdminStudentAbsence[]> {
    const { data, error } = await this.supabaseAdmin.client.rpc(
      'admin_students_absences',
      {
        p_semester_id: filters.semesterId ?? null,
        p_teacher_id: filters.teacherId ?? null,
        p_subject_id: filters.subjectId ?? null,
        p_limit: filters.limit ?? 10,
      },
    );
    if (error) {
      this.logger.error('adminStudentsAbsences', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }
}
