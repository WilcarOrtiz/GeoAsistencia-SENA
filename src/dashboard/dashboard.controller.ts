import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import type { ICurrentUser } from 'src/common/interface/current-user.interface';
import { GetUser } from 'src/common/decorators';
import { AdminFilterDto } from './dto/admin-filters.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/attendance')
  AdminAttendance(
    @GetUser() user: ICurrentUser,
    @Query() filters: AdminFilterDto,
  ) {
    return this.dashboardService.adminAttendance(filters);
  }

  @Get('teacher/attendance')
  TeacherAttendance(@GetUser() user: ICurrentUser) {
    return this.dashboardService.teacherAttendance(user.authId);
  }

  @Get('admin/overview')
  adminOverview(
    @GetUser() user: ICurrentUser,
    @Query() filters: AdminFilterDto,
  ) {
    return this.dashboardService.adminOverview(filters);
  }

  @Get('teacher/overview')
  teacherOverview(@GetUser() user: ICurrentUser) {
    return this.dashboardService.teacherOverview(user.authId);
  }
}
