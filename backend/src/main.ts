import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file (if exists) or from process env (Render)
dotenv.config({
  path: path.resolve(__dirname, '../.env.production'),
  override: true,
});

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { AuditService } from './modules/audit/audit.service';
import { getEnvConfig } from './config/env.config';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  // Validate environment variables early
  const appConfig = getEnvConfig();

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global audit interceptor (can be disabled with AUDIT_ENABLED=false)
  if (appConfig.AUDIT_ENABLED !== false) {
    const auditService = app.get(AuditService);
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new AuditInterceptor(auditService, reflector));
  }

  // Set global prefix
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.setGlobalPrefix(appConfig.API_PREFIX);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable graceful shutdown
  enableGracefulShutdown(app);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.listen(appConfig.PORT, '0.0.0.0');
  logger.log(
    `Application is running on: http://localhost:${appConfig.PORT}/${appConfig.API_PREFIX}`,
  );
  logger.log(`Environment: ${appConfig.NODE_ENV}`);
}

function enableGracefulShutdown(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
) {
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

  signals.forEach((signal) => {
    process.on(signal, () => {
      logger.log(`Received ${signal}, starting graceful shutdown...`);

      // Allow 30 seconds for graceful shutdown
      const timeout = 30000;

      // Close HTTP server first
      app.close()
        .then(() => {
          logger.log('HTTP server closed');
          process.exit(0);
        })
        .catch((error) => {
          logger.error('Error during graceful shutdown', error);
          process.exit(1);
        });

      // Force exit after timeout
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, timeout).unref();
    });
  });
}

void bootstrap();
