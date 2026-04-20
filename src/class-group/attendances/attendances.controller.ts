import { Body, Controller, Patch } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { ApiOperation } from '@nestjs/swagger';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Patch()
  @ApiOperation({
    summary: 'Registrar MI ASITENCIA',
  })
  async mark(@Body() dto: MarkAttendanceDto) {
    const attendance = await this.attendancesService.markAttendance(dto);
    return attendance;
  }
}
