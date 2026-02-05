import { IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  actorId!: string;

  @IsString()
  action!: string;

  @IsString()
  entity!: string;

  @IsOptional()
  payload?: Record<string, any>;
}
