import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { AccessControlModuleModule } from './access-control-module/access-control-module.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ClassGroupModule } from './class-group/class-group.module';
import { UsersModule } from './users/users.module';
import { AcademicModule } from './academic/academic.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CommonModule,
    SeedModule,
    AccessControlModuleModule,
    SupabaseModule,
    AcademicModule,
    AuthModule,
    ClassGroupModule,
    UsersModule,
    DashboardModule,
  ],
  providers: [],
})
export class AppModule {}
