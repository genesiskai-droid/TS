import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  errorId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const isProduction = process.env.NODE_ENV === 'production';
    const errorId = isProduction ? randomUUID() : undefined;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string | string[]) || exception.message;
        error = (resp.error as string) || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;

      // Log errors in production
      if (isProduction) {
        this.logger.error(`Error ID: ${errorId}`, exception.stack);
      } else {
        this.logger.error(exception.message, exception.stack);
      }
    }

    // Log unexpected errors
    if (
      !(exception instanceof HttpException) &&
      !(exception instanceof Error)
    ) {
      if (isProduction) {
        this.logger.error(`Unknown error ID: ${errorId}`, exception as Error);
      } else {
        this.logger.error('Unknown error', exception as Error);
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(errorId && { errorId }),
    };

    response.status(status).json(errorResponse);
  }
}
