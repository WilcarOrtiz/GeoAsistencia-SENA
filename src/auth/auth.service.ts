import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseAdminService } from 'src/supabase/supabase-admin/supabase-admin.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseAdmin: SupabaseAdminService) {}

  async createUserCredentials(email: string, id: string) {
    const { data, error } =
      await this.supabaseAdmin.client.auth.admin.createUser({
        email: email,
        password: id,
        email_confirm: true,
      });

    if (error) {
      if (error.message.includes('already registered'))
        throw new BadRequestException('El correo electrónico ya está en uso');

      throw new InternalServerErrorException(
        `Error de Supabase: ${error.message}`,
      );
    }

    if (!data?.user)
      throw new InternalServerErrorException(
        'No se pudo crear el usuario en Auth',
      );

    return data.user.id;
  }

  async deleteAllUserCredentials() {
    const supabase = this.supabaseAdmin.client;

    let page = 1;
    const perPage = 1000;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) throw error;

      if (!data.users.length) break;

      await Promise.all(
        data.users.map((user) => supabase.auth.admin.deleteUser(user.id)),
      );

      page++;
    }
  }

  async deleteUserCredentials(id: string) {
    await this.supabaseAdmin.client.auth.admin.deleteUser(id);
  }
}
