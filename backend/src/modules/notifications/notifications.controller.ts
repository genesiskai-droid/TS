import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getMyNotifications(@Req() req: { user: AuthenticatedUser }) {
    return this.notificationsService.findByUser(req.user.userId);
  }
}
