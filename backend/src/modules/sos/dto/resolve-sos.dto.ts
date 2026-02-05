import { IsOptional, IsString } from 'class-validator';

export class ResolveSosDto {
  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
