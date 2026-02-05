import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
}

interface DbHealthStatus {
  status: 'ok' | 'error';
  database: string;
  latency: number;
  timestamp: string;
}

@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getStatus(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('db')
  async getDbHealth(): Promise<DbHealthStatus> {
    const start = Date.now();
    try {
      // Simple query to check database connection
      await this.prismaService.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;

      return {
        status: 'ok',
        database: 'connected',
        latency,
        timestamp: new Date().toISOString(),
      };
    } catch {
      const latency = Date.now() - start;
      return {
        status: 'error',
        database: 'disconnected',
        latency,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('ready')
  readiness(): { status: string; timestamp: string } {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  liveness(): { status: string; timestamp: string } {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
