import { IsOptional, IsString, IsNumber } from 'class-validator';
import { TicketStatus } from '../../../types/booking-status.enum';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  modality?: string;
}
