/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createRemoteJWKSet, type JWTVerifyGetKey } from 'jose';

export const JOSE_JWKS_PROVIDER = 'JOSE_JWKS_PROVIDER';

export const JwksProvider = {
  provide: JOSE_JWKS_PROVIDER,
  useFactory: (): JWTVerifyGetKey => {
    const jwksUrl = process.env.SUPABASE_JWKS_URL;

    if (!jwksUrl) {
      throw new Error(' SUPABASE_JWKS_URL no definida');
    }

    return createRemoteJWKSet(new URL(jwksUrl)) as JWTVerifyGetKey;
  },
};
