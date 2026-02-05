import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export enum SosPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class TriggerSosDto {
  /**
   * Descripción libre de la emergencia
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  /**
   * Prioridad declarada por el usuario o sistema
   */
  @IsOptional()
  @IsEnum(SosPriority)
  priority?: SosPriority;

  /**
   * Ubicación textual (dirección, referencia)
   */
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * ID opcional del booking relacionado (si existe)
   */
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  /**
   * Metadata libre (sensores, frontend, app móvil, etc.)
   */
  @IsOptional()
  metadata?: Record<string, any>;
}
