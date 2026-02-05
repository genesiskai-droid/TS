import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JsonValue } from '@prisma/client/runtime/library';

interface AuditLogParams {
  actorId: string;
  action: string;
  entity: string;
  payload?: JsonValue;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  log(params: AuditLogParams): void {
    const auditData = {
      actorId: params.actorId,
      action: params.action,
      entity: params.entity,
      payload: params.payload ?? {},
    };

    // Log asincrónico para no bloquear el request
    this.prisma.auditLog
      .create({ data: auditData })
      .then(() => {
        this.logger.log(
          `AUDIT: ${params.action} on ${params.entity} by ${params.actorId}`,
        );
      })
      .catch((error) => {
        this.logger.error(`AUDIT ERROR: ${error.message}`, error.stack);
      });
  }
}
