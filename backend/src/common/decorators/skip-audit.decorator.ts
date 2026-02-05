import { SetMetadata } from '@nestjs/common';
import { AUDIT_SKIP_KEY } from '../interceptors/audit.interceptor';

/**
 * Decorador para excluir un endpoint de la auditoría global.
 *
 * @example
 * @SkipAudit()
 * @Get('health')
 * healthCheck() { ... }
 */
export const SkipAudit = () => SetMetadata(AUDIT_SKIP_KEY, true);
