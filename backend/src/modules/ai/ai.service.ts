import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiProvider } from './providers/gemini.provider';
import { Role } from '../auth/enums/role.enum';

const AI_ACCESSIBLE_ROLES: Role[] = [Role.ADMIN, Role.MANAGER, Role.TECNICO];

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiProvider,
  ) {}

  async ask(
    userId: string,
    role: Role,
    prompt: string,
    context?: Record<string, any>,
  ): Promise<{ response: string }> {
    if (!AI_ACCESSIBLE_ROLES.includes(role)) {
      throw new ForbiddenException('IA access denied');
    }

    const fullPrompt = `
Context:
${JSON.stringify(context ?? {}, null, 2)}

Prompt:
${prompt}
`.trim();

    try {
      const response = await this.gemini.generate(fullPrompt);

      await (this.prisma as any).aiInteraction.create({
        data: {
          userId,
          prompt,
          response,
          model: 'gemini',
          metadata: context ?? {},
        },
      });

      return { response };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      throw new InternalServerErrorException(
        `Gemini AI request failed: ${message}`,
      );
    }
  }
}
