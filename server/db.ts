import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Check if DATABASE_URL is set, fallback to undefined for local development
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL must be set in production');
}

// Create the database connection
export const getDb = () => {
  if (!databaseUrl) {
    // Return null for in-memory mode (local development without DB)
    return null;
  }
  
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
};

export const db = getDb();
export type Db = ReturnType<typeof getDb>;
