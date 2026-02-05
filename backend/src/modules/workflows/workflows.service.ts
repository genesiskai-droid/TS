import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}
  private readonly transitions: Record<string, any[]> = {
    PENDING: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'FAILED', 'CANCELLED'],
    COMPLETED: [],
    FAILED: ['PENDING', 'CANCELLED'],
    CANCELLED: [],
  };

  async getById(id: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async getByBookingId(bookingId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { bookingId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found for this booking');
    }

    return workflow;
  }

  async create(data: { name: string; bookingId: string; userId: string }) {
    return this.prisma.workflow.create({
      data: {
        name: data.name,
        currentState: 'PENDING' as any,
        bookingId: data.bookingId,
        userId: data.userId,
      },
    });
  }

  async transition(
    id: string,
    nextState: string,
    event: string,
    actorId: string,
    reason?: string,
  ) {
    const workflow = await this.getById(id);
    const allowed = this.transitions[workflow.currentState as any] || [];

    if (!allowed.includes(nextState)) {
      throw new BadRequestException(
        `Invalid transition from ${workflow.currentState} to ${nextState}`,
      );
    }

    const previousState = workflow.currentState;

    return this.prisma.workflow.update({
      where: { id },
      data: {
        currentState: nextState as any,
        event: event as any,
        metadata: {
          previousState,
          actorId,
          reason,
          transitionedAt: new Date().toISOString(),
        } as any,
      },
    });
  }
}
