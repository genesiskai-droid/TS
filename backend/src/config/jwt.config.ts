// JWT configuration - Use environment variables for security
// Get your secrets from: https://dashboard.stripe.com/apikeys (no, different place for JWT)
const JWT_SECRET_ENV = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET_ENV = process.env.JWT_REFRESH_SECRET;

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export const getJwtConfig = (): JwtConfig => {
  // Validación estricta: las claves deben estar configuradas
  if (!JWT_SECRET_ENV) {
    throw new Error(
      'JWT configuration error: JWT_SECRET is not set. ' +
        'Please configure your JWT secret in the environment variables. ' +
        'This is required for production security.',
    );
  }
  if (!JWT_REFRESH_SECRET_ENV) {
    throw new Error(
      'JWT configuration error: JWT_REFRESH_SECRET is not set. ' +
        'Please configure your refresh token secret in the environment variables. ' +
        'This is required for production security.',
    );
  }

  return {
    secret: JWT_SECRET_ENV,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: JWT_REFRESH_SECRET_ENV,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
};
