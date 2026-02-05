import { z } from 'zod';

export const envValidationSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('api'),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('1d'),

  // Redis (optional)
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),

  // Stripe (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Gemini AI (optional)
  GEMINI_API_KEY: z.string().optional(),

  // Rate Limiting
  THROTTLE_TTL: z.coerce.number().default(60),
  THROTTLE_LIMIT: z.coerce.number().default(100),

  // Audit
  AUDIT_ENABLED: z.coerce.boolean().default(true),
});

export type EnvConfig = z.infer<typeof envValidationSchema>;

export const validateEnv = (
  env: Record<string, string | undefined>,
): EnvConfig => {
  const result = envValidationSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (e) => `${e.path.join('.')}: ${e.message}`,
    );
    throw new Error(`Validation failed:\n${errors.join('\n')}`);
  }

  return result.data;
};
