import { IsOptional, IsString } from 'class-validator';

export class CreateSosDto {
  /**
   * Descripción opcional de la emergencia
   */
  @IsOptional()
  @IsString()
  description?: string;
}
