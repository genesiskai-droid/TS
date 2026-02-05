import { IsOptional, IsString, IsUUID } from 'class-validator';

export class WorkflowContextDto {
  /**
   * Identificador del actor que ejecuta la acción
   * (admin, manager, técnico, sistema, IA, etc.)
   */
  @IsOptional()
  @IsUUID()
  actorId?: string;

  /**
   * Rol del actor en el momento de la transición
   */
  @IsOptional()
  @IsString()
  actorRole?: string;

  /**
   * Motivo explícito del cambio de estado
   * (cancelación, finalización, reasignación, etc.)
   */
  @IsOptional()
  @IsString()
  reason?: string;

  /**
   * Origen de la acción
   * (frontend, backend, cron, webhook, IA)
   */
  @IsOptional()
  @IsString()
  source?: string;

  /**
   * Metadata libre para auditoría o IA
   */
  @IsOptional()
  metadata?: Record<string, any>;
}
