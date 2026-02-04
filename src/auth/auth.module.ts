import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { SupabaseAuthGuard } from './guard/supabase-auth.guard';
import { JwksProvider } from './provider/supabase-jwks.provider';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwksProvider,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
  exports: [AuthService],
  imports: [SupabaseModule],
})
export class AuthModule {}
