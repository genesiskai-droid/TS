import { IsEnum } from 'class-validator';
import { WorkflowState } from '@prisma/client';

export class TransitionWorkflowDto {
  @IsEnum(WorkflowState)
  nextStatus: WorkflowState;
}
