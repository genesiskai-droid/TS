import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('session')
  createSession(@Body() dto: CreatePaymentSessionDto, @Req() req: any) {
    return this.paymentsService.createPaymentSession(dto, req.user.userId);
  }
}
