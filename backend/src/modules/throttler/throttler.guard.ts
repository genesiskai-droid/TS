import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    // Exclude health checks from rate limiting
    if (url.startsWith('/health') || url.startsWith('/api/health')) {
      return true;
    }
    return await Promise.resolve(false);
  }
}
