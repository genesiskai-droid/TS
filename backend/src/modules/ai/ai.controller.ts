import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiRequestDto } from './dto/ai-request.dto';
import { Role } from '../auth/enums/role.enum';

interface AuthenticatedUser {
  userId: string;
  role: Role;
  email: string;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async ask(
    @Req() req: { user: AuthenticatedUser },
    @Body() body: AiRequestDto,
  ) {
    const { userId, role } = req.user;

    return this.aiService.ask(userId, role, body.prompt, body.context);
  }
}
