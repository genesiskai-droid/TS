import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('available-technicians')
  getAvailableTechnicians() {
    return this.bookingsService.getAvailableTechnicians();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.bookingsService.findByClient(clientId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @Put(':id/assign-technician')
  assignTechnician(@Param('id') id: string, @Body() dto: AssignTechnicianDto) {
    const technicianId = dto.technicianId;
    if (!technicianId) {
      throw new Error('technicianId is required');
    }
    return this.bookingsService.assignTechnician(id, technicianId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; note?: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.bookingsService.updateStatus(id, body.status as any, body.note);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.bookingsService.cancel(id, body?.reason);
  }
}
