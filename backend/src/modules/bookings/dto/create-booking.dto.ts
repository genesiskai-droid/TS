import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsUUID()
  clientId!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  modality?: string;

  @IsOptional()
  @IsBoolean()
  isSOS?: boolean;
}
