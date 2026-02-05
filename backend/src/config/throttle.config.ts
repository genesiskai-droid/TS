export interface ThrottleConfig {
  ttl: number; // Time to live in milliseconds
  limit: number; // Max requests per TTL
}

const THROTTLE_TTL_ENV = parseInt(process.env.THROTTLE_TTL || '60000', 10); // Default: 60 seconds
const THROTTLE_LIMIT_ENV = parseInt(process.env.THROTTLE_LIMIT || '100', 10); // Default: 100 requests

export const getThrottleConfig = (): ThrottleConfig => ({
  ttl: THROTTLE_TTL_ENV,
  limit: THROTTLE_LIMIT_ENV,
});

// Helper to get ThrottlerModule options for AppModule
export const getThrottlerOptions = () => ({
  throttlers: [
    {
      ttl: THROTTLE_TTL_ENV,
      limit: THROTTLE_LIMIT_ENV,
    },
  ],
  // Exclude health checks from rate limiting
  ignoreUserAgents: [
    // Regex patterns to exclude (optional)
  ],
});
