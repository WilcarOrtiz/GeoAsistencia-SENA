import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseAdminService } from 'src/supabase/supabase-admin/supabase-admin.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly supabaseAdmin: SupabaseAdminService) {}

  async updateUserEmail(authId: string, email: string) {
    const { error } = await this.supabaseAdmin.client.auth.admin.updateUserById(
      authId,
      {
        email,
      },
    );

    if (error) {
      if (error.message.includes('already registered')) {
        throw new BadRequestException('Email ya está en uso');
      }
      this.logger.error(
        `Error actualizando email en Supabase: ${error.message}`,
      );
      throw new InternalServerErrorException('Error al actualizar el email');
    }
  }

  async createUserCredentials(email: string, id: string) {
    const { data, error } =
      await this.supabaseAdmin.client.auth.admin.createUser({
        email,
        password: id,
        email_confirm: true,
      });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new BadRequestException('El correo ya está en uso');
      }

      this.logger.error(`Error creando usuario en Supabase: ${error.message}`);
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }

    if (!data?.user) {
      this.logger.error('Supabase no retornó el usuario tras crearlo');
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }

    return data.user.id;
  }

  async deleteAllUserCredentials() {
    const supabase = this.supabaseAdmin.client;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      if (error)
        throw new InternalServerErrorException(
          `Error listing users: ${error.message}`,
        );
      if (!data.users || data.users.length === 0) {
        hasMore = false;
        break;
      }

      await Promise.all(
        data.users.map(async (user) => {
          try {
            await supabase.auth.admin.deleteUser(user.id);
          } catch (error) {
            this.logger.error(error);
          }
        }),
      );
    }
  }

  async deleteUserCredentials(id: string) {
    await this.supabaseAdmin.client.auth.admin.deleteUser(id);
  }
}
