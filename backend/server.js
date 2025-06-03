import express from 'express';
import 'dotenv/config';
import { sql } from './config/db.js';

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 5001;

async function connectToDatabase() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
        console.log('Database connected and table created successfully.'); 
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); //Satus code 1 indicates an error, 0 indicates success
    }
}

app.post('/api/transactions', async (req, res) => {
    try{
        const { user_id, title, amount, category } = req.body;

        if(!user_id || !title || amount === undefined || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *;
        `;

        console.log('Transaction created:', transaction[0]);
        
        res.status(201).json({
            message: 'Transaction created successfully.',
            transaction: transaction[0] // Return the created transaction
        });

    } catch (error) {
        console.log('Error creating transaction:', error);
        return res.status(500).json({ error: 'Internal server error.' });
        
    }
});

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})