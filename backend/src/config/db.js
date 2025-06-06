import {neon} from '@neondatabase/serverless';
import 'dotenv/config';

const DB_URL = process.env.DATABASE_URL;

// Create a Sql client using the Neon serverless driver
export const sql = neon(DB_URL)

export async function connectToDatabase() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_DATE
    )`;
        console.log('Database connected and table created successfully.');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); //Satus code 1 indicates an error, 0 indicates success
    }
}