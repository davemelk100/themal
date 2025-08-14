import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon connection
const sql = neon(databaseUrl);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export schema for use in other files
export { schema };
