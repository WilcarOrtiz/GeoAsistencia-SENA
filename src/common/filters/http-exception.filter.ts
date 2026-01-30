import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface NestErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // ERRORES DE BASE DE DATOS
    if (exception instanceof QueryFailedError) {
      const dbError = exception.driverError as {
        code?: string;
        detail?: string;
      };

      if (dbError.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Registro duplicado';
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = 'Error de base de datos';
      }

      this.logger.error('DB Error', dbError);
    }

    // ERRORES HTTP DE NEST
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as string | NestErrorResponse;

      if (typeof res === 'object' && res !== null) {
        const errorMsg = res.message;
        message = Array.isArray(errorMsg)
          ? errorMsg[0]
          : errorMsg || 'Error de validación';
      } else {
        message = res;
      }
    }

    // ERRORES DESCONOCIDOS
    else {
      const error = exception as Error;
      this.logger.error(`Error no controlado: ${error.message}`, error.stack);
    }

    response.status(status).json({
      ok: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
