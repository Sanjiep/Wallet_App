import {neon} from '@neondatabase/serverless';
import 'dotenv/config';

const DB_URL = process.env.DATABASE_URL;

// Create a Sql client using the Neon serverless driver
export const sql = neon(DB_URL)