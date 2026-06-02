import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAdminService implements OnModuleInit {
  private supabaseAdmin!: SupabaseClient<any, any, any>;
  private readonly logger = new Logger(SupabaseAdminService.name);

  onModuleInit() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      this.logger.error(
        'Faltan las variables de entorno de administración de Supabase.',
      );

      throw new Error(
        'Faltan las variables de entorno de administración de Supabase.',
      );
    }

    this.supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  get client() {
    return this.supabaseAdmin;
  }
}
