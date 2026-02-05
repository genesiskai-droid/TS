import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketStatus } from '../../types/booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    return await (this.prisma as any).ticket.create({
      data: {
        type: dto.type || 'Mantenimiento',
        title: dto.title || 'Nueva solicitud',
        status: 'Registrado',
        priority: dto.priority || 'Normal',
        clientId: dto.clientId,
        location: dto.location,
        observations: dto.observations,
        estimatedCost: dto.estimatedCost || 0,
        modality: dto.modality || 'Taller',
        isSOS: dto.isSOS || false,
        date: new Date(),
      },
    });
  }

  async findAll() {
    return await (this.prisma as any).ticket.findMany({
      include: {
        client: true,
        technicalStaff: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    const ticket = await (this.prisma as any).ticket.findUnique({
      where: { id },
      include: {
        client: true,
        technicalStaff: true,
        history: true,
        receptionItems: true,
        deviceDetails: true,
        technicalReport: {
          include: { quoteItems: true },
        },
        billing: true,
        warranty: true,
        payments: true,
        assignments: {
          include: { technicalStaff: true },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async findByClient(clientId: string) {
    return await (this.prisma as any).ticket.findMany({
      where: { clientId },
      include: {
        technicalStaff: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: string, dto: UpdateBookingDto) {
    await this.findById(id); // Verify exists

    return await (this.prisma as any).ticket.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.observations && { observations: dto.observations }),
        ...(dto.cost !== undefined && { cost: dto.cost }),
        ...(dto.modality && { modality: dto.modality }),
      },
    });
  }

  async assignTechnician(id: string, technicianId: string) {
    await this.findById(id);

    // Update ticket

    await (this.prisma as any).ticket.update({
      where: { id },
      data: {
        technicalStaffId: technicianId,
        status: 'Asignado',
      },
    });

    // Create assignment record

    return await (this.prisma as any).ticketAssignment.create({
      data: {
        ticketId: id,
        technicalStaffId: technicianId,
      },
    });
  }

  async updateStatus(id: string, status: TicketStatus, note?: string) {
    await this.findById(id);

    // Update ticket status

    const ticket = await (this.prisma as any).ticket.update({
      where: { id },
      data: { status },
    });

    // Add history entry
    if (note) {
      await (this.prisma as any).historyEntry.create({
        data: {
          ticketId: id,
          status,
          note,
        },
      });
    }

    return ticket;
  }

  async cancel(id: string, reason?: string) {
    await this.findById(id);
    return this.updateStatus(id, TicketStatus.Cancelado, reason);
  }

  async addHistoryEntry(ticketId: string, status: string, note: string) {
    return await (this.prisma as any).historyEntry.create({
      data: {
        ticketId,
        status,
        note,
      },
    });
  }

  async addReceptionItem(
    ticketId: string,
    data: {
      type: string;
      brand: string;
      model: string;
      serial: string;
      quantity: number;
      status: string;
      notes?: string;
    },
  ) {
    return await (this.prisma as any).receivedItem.create({
      data: {
        ticketId,
        ...data,
      },
    });
  }

  async getAvailableTechnicians() {
    return await (this.prisma as any).technicalStaff.findMany({
      orderBy: { currentWorkload: 'asc' },
    });
  }
}
