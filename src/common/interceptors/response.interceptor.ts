import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Definimos la interfaz de forma que TypeScript no se queje por los nulos
export interface StandardResponse<T> {
  ok: boolean;
  message: string;
  data: T | null; // Permitimos explícitamente null aquí
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
        // 1. Verificación básica de objeto
        const isObject = typeof res === 'object' && res !== null;
        const resObj = isObject ? (res as Record<string, unknown>) : null;

        // 2. Extraer mensaje
        const message =
          resObj && typeof resObj.message === 'string'
            ? resObj.message
            : 'Operación exitosa';

        // 3. Determinar data
        let data = resObj && resObj.data !== undefined ? resObj.data : res;

        // 4. Limpiar el mensaje de la data si existe
        if (typeof data === 'object' && data !== null) {
          // Creamos una copia y eliminamos la propiedad message
          // Usamos una copia simple para evitar el error de variable no usada (_)
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
