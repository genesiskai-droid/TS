import { validateEnv } from './validation.config';

const configCache: { value: any } = { value: null };

export const getEnvConfig = () => {
  if (configCache.value) {
    return configCache.value;
  }

  // Build env object from process.env
  const env: Record<string, string | undefined> = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    API_PREFIX: process.env.API_PREFIX,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    THROTTLE_TTL: process.env.THROTTLE_TTL,
    THROTTLE_LIMIT: process.env.THROTTLE_LIMIT,
    AUDIT_ENABLED: process.env.AUDIT_ENABLED,
    FRONTEND_URL: process.env.FRONTEND_URL,
  };

  // Debug log to check JWT_SECRET
  console.log('[ENV CHECK]', {
    JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length,
    JWT_SECRET_VALUE: process.env.JWT_SECRET,
  });

  configCache.value = validateEnv(env);
  return configCache.value;
};

// Convenience getters for commonly used env vars
export const getNodeEnv = (): string => getEnvConfig().NODE_ENV;
export const isProduction = (): boolean =>
  getEnvConfig().NODE_ENV === 'production';
export const isDevelopment = (): boolean =>
  getEnvConfig().NODE_ENV === 'development';
export const isStaging = (): boolean => getEnvConfig().NODE_ENV === 'staging';
