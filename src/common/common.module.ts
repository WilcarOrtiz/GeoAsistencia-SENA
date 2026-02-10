import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwksProvider } from './provider/supabase-jwks.provider';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseAuthGuard } from './guard/supabase-auth.guard';
import { PermissionsGuard } from './guard/PermissionsGuard.guard';

@Global()
@Module({
  imports: [UserModule],
  providers: [
    JwksProvider,
    PermissionsGuard,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
  exports: [JwksProvider, PermissionsGuard],
})
export class CommonModule {}
