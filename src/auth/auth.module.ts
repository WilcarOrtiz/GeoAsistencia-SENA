import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [SupabaseModule],
})
export class AuthModule {}
