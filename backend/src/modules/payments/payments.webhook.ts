import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';
import { PaymentStatus } from './enums/payment-status.enum';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(@Body() dto: WebhookPaymentDto) {
    switch (dto.status) {
      case PaymentStatus.COMPLETED:
        return this.paymentsService.markAsPaid(dto.reference);
      case PaymentStatus.FAILED:
        return this.paymentsService.markAsFailed(dto.reference);
      case PaymentStatus.PENDING:
      case PaymentStatus.CANCELED:
        // These statuses don't require action
        return { received: true, status: dto.status };
      default:
        return { received: true, status: 'unknown' };
    }
  }
}
