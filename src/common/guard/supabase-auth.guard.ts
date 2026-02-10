/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: process.env.SUPABASE_ISSUER,
        audience: 'authenticated',
      });

      if (!payload.sub)
        throw new UnauthorizedException(
          'Token malformado: falta identificador',
        );

      const dbUser = await this.userService.validateActiveUserByAuthId(
        payload.sub,
      );

      if (!dbUser) throw new UnauthorizedException('Usuario no autorizado');

      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(dbUser);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      const allPermissions = dbUser.roles.flatMap((role) =>
        role.permissions.map((p) => p.name),
      );
      const uniquePermissions = [...new Set(allPermissions)];

      request.user = {
        authId: dbUser.auth_id,
        ID_user: dbUser.ID_user,
        email: (payload.email as string) || '',
        roles: dbUser.roles?.map((r) => r.name) ?? [],
        permissions: uniquePermissions,
      };

      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(request.user);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      return true;
    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new UnauthorizedException('Token inválido');
    }
  }
}
