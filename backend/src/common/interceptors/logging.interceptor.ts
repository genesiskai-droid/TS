import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  userId?: string;
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  private readonly logLevel: 'debug' | 'info' | 'warn' | 'error';

  constructor() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    // Set log level based on environment
    if (nodeEnv === 'production') {
      this.logLevel = 'info';
    } else if (nodeEnv === 'staging') {
      this.logLevel = 'debug';
    } else {
      this.logLevel = 'debug';
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const { method, url, user, headers } = request as {
      method: string;
      url: string;
      user?: { userId?: string; sub?: string };
      headers?: Record<string, string>;
    };

    const startTime = Date.now();
    const userAgent = headers?.['user-agent'];
    const ip = headers?.['x-forwarded-for'] || request?.ip;

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const duration = Date.now() - startTime;

          const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode,
            duration,
            userId: user?.userId || user?.sub,
            userAgent,
            ip: typeof ip === 'string' ? ip.split(',')[0] : ip,
          };

          this.logToConsole(logEntry, 'info');
        },
        error: (error) => {
          const statusCode = error.status || 500;
          const duration = Date.now() - startTime;

          const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode,
            duration,
            userId: user?.userId || user?.sub,
            userAgent,
            ip: typeof ip === 'string' ? ip.split(',')[0] : ip,
          };

          this.logToConsole(logEntry, 'error');
          // In production, don't expose error details in response
          if (process.env.NODE_ENV === 'production') {
            this.logger.error(
              `${method} ${url} - ${statusCode} - ${duration}ms`,
            );
          } else {
            this.logger.error(
              `${method} ${url} - ${statusCode} - ${duration}ms`,
              error.stack,
            );
          }
        },
      }),
    );
  }

  private logToConsole(logEntry: LogEntry, level: 'info' | 'error'): void {
    const json = JSON.stringify(logEntry);

    switch (level) {
      case 'error':
        console.error(json);
        break;
      default:
        console.log(json);
    }
  }
}
