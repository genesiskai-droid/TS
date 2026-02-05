import { ThrottlerModule as ThrottlerModulePackage } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import { CustomThrottlerGuard } from './throttler.guard';

@Module({
  imports: [
    ThrottlerModulePackage.forRootAsync({
      useFactory: () => [
        {
          ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
          limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
        },
      ],
    }),
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: CustomThrottlerGuard,
    },
  ],
  exports: [ThrottlerModulePackage],
})
export class ThrottlerModule {}
