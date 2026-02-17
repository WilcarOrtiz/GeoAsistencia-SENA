import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtVerify, type JWTVerifyGetKey } from 'jose';
import { PUBLIC_KEY } from 'src/common/constants/key-decorators';
import { JOSE_JWKS_PROVIDER } from '../provider/supabase-jwks.provider';
import { UserService } from 'src/user/user.service';
import { ICurrentUser } from '../interface/current-user.interface';

interface RequestWithUser extends Request {
  user?: ICurrentUser;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject(JOSE_JWKS_PROVIDER) private readonly jwks: JWTVerifyGetKey,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'] as string | undefined;
    const token = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token no proporcionado');

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: process.env.SUPABASE_ISSUER,
        audience: 'authenticated',
      });

      if (!payload.sub)
        throw new UnauthorizedException('Malformed token: missing identifier');

      const dbUser = await this.userService.validateActiveUserByAuthId(
        payload.sub,
      );

      if (!dbUser) throw new UnauthorizedException('Unauthorized user');
      request.user = {
        authId: dbUser.auth_id,
        ID_user: dbUser.ID_user,
        email: (payload.email as string) || '',
        roles: dbUser.roles.map((r) => r.name),
        permissions: dbUser.processedPermissions,
      };

      return true;
    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new UnauthorizedException('Invalid token');
    }
  }
}
