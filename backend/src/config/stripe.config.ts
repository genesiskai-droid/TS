export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  currency: string;
}

// Stripe configuration - Use environment variables for security
// Get your keys from: https://dashboard.stripe.com/apikeys
const STRIPE_SECRET_KEY_ENV = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET_ENV = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_CURRENCY_ENV = process.env.STRIPE_CURRENCY || 'usd';

export const getStripeConfig = (): StripeConfig => {
  // Validación estricta: las claves deben estar configuradas
  if (!STRIPE_SECRET_KEY_ENV) {
    throw new Error(
      'Stripe configuration error: STRIPE_SECRET_KEY is not set. ' +
        'Please configure your Stripe API keys in the environment variables. ' +
        'See https://stripe.com/docs/keys for more information.',
    );
  }
  if (!STRIPE_WEBHOOK_SECRET_ENV) {
    throw new Error(
      'Stripe configuration error: STRIPE_WEBHOOK_SECRET is not set. ' +
        'Please configure your Stripe webhook secret in the environment variables. ' +
        'See https://stripe.com/docs/webhooks for more information.',
    );
  }

  const config: StripeConfig = {
    secretKey: STRIPE_SECRET_KEY_ENV,
    webhookSecret: STRIPE_WEBHOOK_SECRET_ENV,
    currency: STRIPE_CURRENCY_ENV,
  };

  return config;
};
