import postgres from 'postgres';

const FALLBACK_DB_URL =
  'postgresql://neondb_owner:npg_1u6EDgkyYJPr@ep-wild-haze-azjcdstd-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const connectionString = process.env.DATABASE_URL || FALLBACK_DB_URL;

const globalForSql = globalThis as unknown as {
  __nephienSql?: ReturnType<typeof postgres>;
};

export const sql =
  globalForSql.__nephienSql ??
  postgres(connectionString, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
    connect_timeout: 15,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSql.__nephienSql = sql;
}
