/**
 * Database configuration for Strapi with Supabase PostgreSQL
 * @see https://docs.strapi.io/dev-docs/configurations/database
 */

interface DatabaseEnv {
  (key: string, defaultValue?: string): string;
  int: (key: string, defaultValue?: number) => number;
  bool: (key: string, defaultValue?: boolean) => boolean;
}

interface SSLConfig {
  readonly rejectUnauthorized: boolean;
}

interface ConnectionConfig {
  readonly connectionString?: string;
  readonly host?: string;
  readonly port?: number;
  readonly database?: string;
  readonly user?: string;
  readonly password?: string;
  readonly ssl?: SSLConfig | false;
}

interface PoolConfig {
  readonly min: number;
  readonly max: number;
}

interface DatabaseConfig {
  readonly connection: {
    readonly client: 'postgres';
    readonly connection: ConnectionConfig;
    readonly pool: PoolConfig;
    readonly acquireConnectionTimeout: number;
    readonly createTimeoutMillis: number;
    readonly destroyTimeoutMillis: number;
    readonly idleTimeoutMillis: number;
    readonly debug: boolean;
  };
}

export default ({ env }: { env: DatabaseEnv }): DatabaseConfig => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'aws-0-eu-central-1.pooler.supabase.com'),
      port: env.int('DATABASE_PORT', 6543), // Connection Pooler port
      database: env('DATABASE_NAME', 'postgres'),
      user: env('DATABASE_USERNAME', 'postgres.ofwjpnieqzxvaqoaeozr'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    createTimeoutMillis: env.int('DATABASE_CREATE_TIMEOUT', 30000),
    destroyTimeoutMillis: env.int('DATABASE_DESTROY_TIMEOUT', 5000),
    idleTimeoutMillis: env.int('DATABASE_IDLE_TIMEOUT', 30000),
    debug: env.bool('DATABASE_DEBUG', false),
  },
});
