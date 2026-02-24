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
export class ResponseIntercdeptor<T> implements NestInterceptor<
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
        const isObject =
          typeof res === 'object' && res !== null && !Array.isArray(res);
        const resObj = isObject ? (res as Record<string, unknown>) : null;

        const message =
          resObj && typeof resObj['message'] === 'string'
            ? resObj['message']
            : 'Operación exitosa';

        let data: unknown;

        if (Array.isArray(res)) {
          data = res;
        } else if (resObj?.['data'] !== undefined) {
          data = resObj['data'];
        } else if (resObj) {
          data = Object.fromEntries(
            Object.entries(resObj).filter(([key]) => key !== 'message'),
          );
        } else {
          data = res;
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
