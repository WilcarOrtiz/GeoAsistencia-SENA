/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // ❗ Importante
import { JWTPayload, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { PUBLIC_KEY } from 'src/common/constants/key-decorators';
import { Request } from 'express';
import { JOSE_JWKS_PROVIDER } from '../provider/supabase-jwks.provider';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject(JOSE_JWKS_PROVIDER)
    private readonly jwks: JWTVerifyGetKey,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JWTPayload }>();
    const authHeader = request.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const keyResolver = this.jwks;

      console.log('Tipo JWKS:', typeof this.jwks);

      const { payload } = await jwtVerify(token, keyResolver, {
        issuer: process.env.SUPABASE_ISSUER,
        audience: 'authenticated',
      });
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

/*curl -X POST 'https://mxcntpwcspuusvzlbdri.supabase.co/auth/v1/token?grant_type=password' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Y250cHdjc3B1dXN2emxiZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjg3MTEsImV4cCI6MjA4NDg0NDcxMX0.kYtc3SAyKu-a0GTbhbglcPG1SQNeZiqaEDJoHlxnXjk' \
-H 'Content-Type: application/json' \
-d '{
  "email": "ortizcolpaswilcardaniel@gmai.com",
  "password": "1023456789"
}'
 */
