import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardResponse } from '../interface/stantard-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((res: unknown) => {
        const isObject = typeof res === 'object' && res !== null;
        const resObj = isObject ? (res as Record<string, unknown>) : null;

        const message =
          resObj && typeof resObj.message === 'string'
            ? resObj.message
            : 'Operación exitosa';

        let data = resObj && resObj.data !== undefined ? resObj.data : res;

        if (typeof data === 'object' && data !== null) {
          const dataCopy = { ...(data as Record<string, unknown>) };
          delete dataCopy.message;
          data = dataCopy;
        }

        return {
          ok: true,
          message,
          data: (data as T) ?? null,
        };
      }),
    );
  }
}
