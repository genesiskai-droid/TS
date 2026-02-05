export interface DatabaseConfig {
  url: string;
  synchronize: boolean;
  logging: boolean;
}

const DATABASE_URL_ENV = process.env.DATABASE_URL;

export const getDatabaseConfig = (): DatabaseConfig => {
  if (!DATABASE_URL_ENV) {
    throw new Error(
      'Database configuration error: DATABASE_URL is not set. ' +
        'Please configure your database connection in the environment variables.',
    );
  }

  return {
    url: DATABASE_URL_ENV,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
};
