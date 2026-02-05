import { Controller, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { TransitionWorkflowDto } from './dto/transition-workflow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

interface JwtUser {
  userId?: string;
  sub?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Patch(':id/transition')
  @Roles(Role.ADMIN, Role.MANAGER, Role.TECNICO)
  transition(
    @Param('id') id: string,
    @Body() dto: TransitionWorkflowDto,
    @Req() req: { user: JwtUser },
  ) {
    const actorId = req.user?.userId || req.user?.sub;
    return this.workflowsService.transition(id, dto.nextStatus, actorId);
  }
}
