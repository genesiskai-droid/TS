import { IsEnum, IsString } from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';

export class WebhookPaymentDto {
  @IsString()
  provider!: string;

  @IsString()
  reference!: string;

  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}
