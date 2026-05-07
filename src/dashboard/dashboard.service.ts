import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AdminFilterDto } from './dto/admin-filters.dto';
import { SupabaseAdminService } from 'src/supabase/supabase-admin/supabase-admin.service';
import {
  AdminGroupAttendance,
  DashboardOverview,
  TeacherGroupAttendance,
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
}
