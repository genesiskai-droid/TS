import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from './enums/notification-type.enum';

/**
 * Notification model type based on Prisma schema
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type guard to check if a value is an Error instance
 */
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Safely extracts error message from any value
 */
function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = await (this.prisma as any).notification.create({
        data: {
          userId: dto.userId,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          data: dto.data ?? Prisma.DbNull,
          isRead: false,
          bookingId: dto.bookingId,
        },
      });
      return notification as Notification;
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger.error(`Failed to create notification: ${message}`);
      throw new Error(`Failed to create notification: ${message}`);
    }
  }

  async findByUser(userId: string): Promise<Notification[]> {
    try {
      const notifications = await (this.prisma as any).notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return notifications as Notification[];
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger.error(`Failed to find notifications for user ${userId}: ${message}`);
      throw new Error(`Failed to find notifications for user ${userId}: ${message}`);
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const notification = await (this.prisma as any).notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
      return notification as Notification;
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger.error(`Failed to mark notification ${notificationId} as read: ${message}`);
      throw new Error(`Failed to mark notification ${notificationId} as read: ${message}`);
    }
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    try {
      const notifications = await (this.prisma as any).notification.findMany({
        where: {
          userId,
          isRead: false,
        },
        orderBy: { createdAt: 'desc' },
      });
      return notifications as Notification[];
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger.error(`Failed to find unread notifications for user ${userId}: ${message}`);
      throw new Error(`Failed to find unread notifications for user ${userId}: ${message}`);
    }
  }
}
