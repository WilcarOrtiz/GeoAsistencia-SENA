import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [SupabaseModule],
})
export class AuthModule {}
