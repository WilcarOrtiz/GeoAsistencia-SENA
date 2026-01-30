import { Global, Module } from '@nestjs/common';
import { SupabaseAdminService } from './supabase-admin/supabase-admin.service';

@Global()
@Module({
  providers: [SupabaseAdminService],
  exports: [SupabaseAdminService],
})
export class SupabaseModule {}

//TODO: Forzar restablecimiento de contraseña
