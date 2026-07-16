import { Pool } from 'pg';
import 'dotenv/config'

// A pool object allowing us to connect with the database specified with the DATABASE_URL environment variable
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

