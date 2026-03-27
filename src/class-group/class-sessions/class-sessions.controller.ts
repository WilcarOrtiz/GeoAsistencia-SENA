import { Controller } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';

@Controller('class-sessions')
export class ClassSessionsController {
  constructor(private readonly classSessionsService: ClassSessionsService) {}
}
