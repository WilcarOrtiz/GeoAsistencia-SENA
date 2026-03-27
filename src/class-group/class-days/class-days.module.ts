import { Module } from '@nestjs/common';
import { ClassDaysController } from './class-days.controller';
import { ClassDaysService } from './class-days.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassDays } from './entities/class-day.entity';
import { ClassGroupsModule } from '../class-groups/class-groups.module';

@Module({
  controllers: [ClassDaysController],
  providers: [ClassDaysService],
  imports: [TypeOrmModule.forFeature([ClassDays]), ClassGroupsModule],
  exports: [TypeOrmModule, ClassDaysService],
})
export class ClassDaysModule {}
