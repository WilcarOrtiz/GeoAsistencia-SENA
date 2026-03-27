import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { ApiOperation } from '@nestjs/swagger';
import { EnrollmentDto } from './dto/enrollment.dto';
import { MoveEnrollmentDto } from './dto/move-enrollment.dto';
import { PublicAccess } from 'src/common/decorators';

@PublicAccess()
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('move')
  @ApiOperation({ summary: 'Mover alumnos de grupo de clase a otro' })
  async moveStudent(@Body() dto: MoveEnrollmentDto) {
    return await this.enrollmentService.moveStudents(
      dto.students,
      dto.fromGroupId,
      dto.toGroupId,
    );
  }

  @Post(':id')
  @ApiOperation({ summary: 'Matricular alumnos en un grupo de clase' })
  async enrollmentStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnrollmentDto,
  ) {
    return await this.enrollmentService.enrollStudents(id, dto.students);
  }
}
