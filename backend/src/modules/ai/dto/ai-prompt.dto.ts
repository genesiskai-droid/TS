import { IsString, IsOptional } from 'class-validator';

export class AiPromptDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  context?: Record<string, any>;
}
