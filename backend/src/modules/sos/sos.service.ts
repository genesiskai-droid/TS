import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../auth/enums/role.enum';

// Tipo unión para roles autorizados en SOS
type SosAuthorizedRole = Extract<Role, 'ADMIN' | 'SOS'>;

@Injectable()
export class SosService {
  constructor(private readonly prisma: PrismaService) {}

  // 🚨 DISPARAR SOS
  trigger(userId: string, description?: string) {
    return (this.prisma as any).sosCase.create({
      data: {
        triggeredById: userId,
        description,
        status: 'PENDING' as any,
      },
    });
  }

  // Verificador de tipo para roles autorizados
  private isSosAuthorizedRole(role: Role): role is SosAuthorizedRole {
    return role === Role.ADMIN || role === Role.SOS;
  }

  // 📋 LISTAR SOS (solo roles autorizados)
  findAll(actorRole: Role) {
    if (!this.isSosAuthorizedRole(actorRole)) {
      throw new ForbiddenException('Not authorized to view SOS cases');
    }
    return (this.prisma as any).sosCase.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        triggeredBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });
  }

  // ✅ RESOLVER SOS
  async resolve(sosId: string, actorRole: Role, resolutionNote?: string) {
    if (!this.isSosAuthorizedRole(actorRole)) {
      throw new ForbiddenException('Not authorized to resolve SOS cases');
    }
    const sos = await (this.prisma as any).sosCase.findUnique({
      where: { id: sosId },
    });

    if (!sos) {
      throw new NotFoundException('SOS case not found');
    }
    return (this.prisma as any).sosCase.update({
      where: { id: sosId },
      data: {
        status: 'RESOLVED' as any,
        resolvedAt: new Date(),
        description: resolutionNote ?? sos.description,
      },
    });
  }

  // ✅ ACKNOWLEDGE SOS
  async acknowledge(sosId: string, actorRole: Role) {
    if (!this.isSosAuthorizedRole(actorRole)) {
      throw new ForbiddenException('Not authorized to acknowledge SOS cases');
    }
    const sos = await (this.prisma as any).sosCase.findUnique({
      where: { id: sosId },
    });

    if (!sos) {
      throw new NotFoundException('SOS case not found');
    }
    return (this.prisma as any).sosCase.update({
      where: { id: sosId },
      data: {
        status: 'ACKNOWLEDGED' as any,
      },
    });
  }
}
