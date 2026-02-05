import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';
import { PaymentStatus } from './enums/payment-status.enum';

@Controller('webhooks/payments')
export class WebhookPaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() dto: WebhookPaymentDto) {
    if (dto.status === PaymentStatus.COMPLETED) {
      await this.paymentsService.markAsPaid(dto.reference);
    } else if (dto.status === PaymentStatus.FAILED) {
      await this.paymentsService.markAsFailed(dto.reference);
    }

    return { received: true, status: dto.status };
  }
}
