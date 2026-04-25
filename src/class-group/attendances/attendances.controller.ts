import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { ApiOperation } from '@nestjs/swagger';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import type { ICurrentUser } from 'src/common/interface/current-user.interface';
import { GetUser } from 'src/common/decorators';
import { MyAttendancesResponseDto } from './dto/my-attendances-response.dto';
import { toDto } from 'src/common/utils/dto-mapper.util';

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

  @Get('group/:groupId/my-history')
  @ApiOperation({ summary: 'Mis asistencias como estudiante en un grupo ' })
  async findMine(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @GetUser() user: ICurrentUser,
  ): Promise<MyAttendancesResponseDto> {
    const result = await this.attendancesService.findMyAttendancesInGroup(
      groupId,
      user.authId,
    );
    return toDto(MyAttendancesResponseDto, result);
  }
}
