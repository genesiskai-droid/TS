import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, PaymentProvider } from './enums/payment-status.enum';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createPaymentSession(dto: CreatePaymentSessionDto, _userId: any) {
    // TODO: Implementar integración con Stripe u otro proveedor de pagos
    // Por ahora, creamos un registro de pago pendiente
    return this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: Math.round(dto.amount),
        currency: dto.currency,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async create(
    bookingId: string,
    amount: number,
    currency: string,
    provider: string,
  ) {
    return this.prisma.payment.create({
      data: {
        bookingId,
        amount: Math.round(amount),
        currency,
        provider,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async markAsPaid(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.COMPLETED as any,
      },
    });
  }

  async markAsFailed(paymentId: string) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.FAILED,
      },
    });
  }
}
