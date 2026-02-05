import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  bookingId: string | undefined;

  @IsNumber()
  amount: number | undefined;

  @IsString()
  currency: string | undefined;

  @IsString()
  provider: string | undefined;
}
