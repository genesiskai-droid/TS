import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SosService } from './sos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TriggerSosDto } from './dto/trigger-sos.dto';
import { ResolveSosDto } from './dto/resolve-sos.dto';

@UseGuards(JwtAuthGuard)
@Controller('sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  // 🚨 CLIENTE / USUARIO
  @Post('trigger')
  trigger(@Req() req: any, @Body() dto: TriggerSosDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.sosService.trigger(req.user.userId, dto.description);
  }

  // 📋 ADMIN / SOS
  @Get()
  findAll(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.sosService.findAll(req.user.role);
  }

  // ✅ ADMIN / SOS
  @Patch(':id/resolve')
  resolve(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: ResolveSosDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.sosService.resolve(id, req.user.role, dto.resolutionNote);
  }

  // ✅ ADMIN / SOS
  @Patch(':id/acknowledge')
  acknowledge(@Param('id') id: string, @Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.sosService.acknowledge(id, req.user.role);
  }
}
