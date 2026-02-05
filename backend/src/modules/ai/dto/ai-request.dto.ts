import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AiRequestDto {
  /**
   * Prompt principal enviado a la IA
   */
  @IsString()
  @MaxLength(4000)
  prompt!: string;

  /**
   * Contexto adicional (workflow, booking, sos, etc.)
   */
  @IsOptional()
  context?: Record<string, any>;
}
