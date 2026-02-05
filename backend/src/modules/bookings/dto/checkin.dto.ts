import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CheckinDto {
  /**
   * Técnico que realiza el check-in
   */
  @IsUUID()
  technicianId: string | undefined;

  /**
   * Ubicación o referencia opcional
   */
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * Nota opcional del técnico
   */
  @IsOptional()
  @IsString()
  note?: string;
}
