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
        throw new BadRequestException('Email is already in use');

      throw new InternalServerErrorException(
        `Supabase error: ${error.message}`,
      );
    }

    if (!data?.user)
      throw new InternalServerErrorException(
        'The user could not be created in Auth Supabase',
      );

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
          } catch (e) {
            console.log(e);
            console.error(`The user ${user.id} could not be deleted in Auth`);
          }
        }),
      );
    }
  }

  async deleteUserCredentials(id: string) {
    await this.supabaseAdmin.client.auth.admin.deleteUser(id);
  }
}
