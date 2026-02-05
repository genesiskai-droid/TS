import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { BookingsModule } from './modules/bookings';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications';
import { PrismaModule } from './prisma/prisma.module';
import { SosModule } from './modules/sos/sos.module';
import { AiModule } from './modules/ai';
import { ConfigModule } from '@nestjs/config';
import { AuditModule } from './modules/audit';
import { ThrottlerModule } from './modules/throttler/throttler.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkflowsModule,
    BookingsModule,
    PaymentsModule,
    NotificationsModule,
    SosModule,
    AiModule,
    AuditModule,
    ThrottlerModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
