import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../../modules/audit/audit.service';

export const AUDIT_SKIP_KEY = 'auditSkip';

export interface CurrentUserData {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  // Endpoints a excluir de la auditoría por defecto
  private readonly excludedPaths: RegExp[] = [/^\/health$/, /^\/api$/];

  // Mapeo de métodos HTTP a acciones de negocio
  private readonly actionMap: Record<string, string> = {
    POST: 'CREATE',
    GET: 'READ',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
  };

  // Rutas de autenticación que requieren auditoría especial
  private readonly authPaths: Record<string, string> = {
    '/auth/login': 'LOGIN',
    '/auth/logout': 'LOGOUT',
    '/auth/register': 'REGISTER',
    '/auth/refresh': 'REFRESH_TOKEN',
  };

  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    // Verificar si el endpoint está excluido por decorador o por path
    if (
      this.shouldSkipByDecorator(context) ||
      this.shouldSkipByPath(request.url)
    ) {
      return next.handle();
    }

    const startTime = Date.now();
    const { method, url, body, user, ip, headers } = request;

    // Determinar la acción y entidad
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { action, entity, entityId } = this.parseRequest(method, url, body);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const response = httpContext.getResponse();

          this.logAudit({
            action,
            entity,
            entityId,
            method,
            url,
            user: user as CurrentUserData | undefined,
            statusCode: response.statusCode,
            duration,
            result: 'success',
            metadata: {
              query: request.query,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              body: this.sanitizeBody(body),
            },
            ip,
            userAgent: headers['user-agent'],
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logAudit({
            action,
            entity,
            entityId,
            method,
            url,
            user: user as CurrentUserData | undefined,
            statusCode: error.status || 500,
            duration,
            result: 'fail',
            metadata: {
              error: error.message,
            },
            ip,
            userAgent: headers['user-agent'],
          });
        },
      }),
    );
  }

  private shouldSkipByDecorator(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(AUDIT_SKIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private shouldSkipByPath(url: string): boolean {
    return this.excludedPaths.some((pattern) => pattern.test(url));
  }

  private parseRequest(
    method: string,
    url: string,
    body: Record<string, unknown>,
  ): { action: string; entity: string; entityId?: string } {
    // Verificar rutas de autenticación
    for (const [path, authAction] of Object.entries(this.authPaths)) {
      if (url.includes(path)) {
        return {
          action: authAction,
          entity: 'auth',
          entityId: undefined,
        };
      }
    }

    // Extraer entidad de la URL
    const urlParts = url.split('/').filter(Boolean);
    // Saltar prefijo de versión API si existe (ej: /api/v1/users -> users)
    const entityIndex = urlParts.findIndex(
      (part) => part === 'api' || part === 'v1',
    );
    const entity =
      urlParts[entityIndex >= 0 ? entityIndex + 1 : 0] || 'unknown';

    // Extraer ID del recurso de la URL o del body
    const idMatch = url.match(/\/([a-f0-9-]{36}|[0-9]+)$/);
    const entityId =
      idMatch?.[1] || ((body?.id || body?.['id']) as string | undefined);

    return {
      action: this.actionMap[method] || 'UNKNOWN',
      entity,
      entityId,
    };
  }

  private sanitizeBody(
    body: Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined {
    if (!body) return undefined;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'accessToken',
      'refreshToken',
      'authorization',
      'Bearer',
    ];

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body)) {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private logAudit(params: {
    action: string;
    entity: string;
    entityId?: string;
    method: string;
    url: string;
    user?: CurrentUserData;
    statusCode: number;
    duration: number;
    result: 'success' | 'fail';
    metadata?: Record<string, unknown>;
    ip?: string;
    userAgent?: string;
  }): void {
    const actorId = params.user?.userId || 'anonymous';

    this.auditService.log({
      actorId,
      action: params.action,
      entity: params.entity,
      payload: {
        actorRole: params.user?.role || 'unknown',
        entityId: params.entityId,
        result: params.result,
        metadata: {
          method: params.method,
          url: params.url,
          statusCode: params.statusCode,
          duration: params.duration,
          ...params.metadata,
        },
      },
    });
  }
}
