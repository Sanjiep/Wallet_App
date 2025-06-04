import express from 'express';
import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import ratelimiterMiddleware from './middleware/ratelimiter.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(ratelimiterMiddleware) // Apply rate limiting middleware
import transactionsRoute from './routes/transactionsRoute.js';

const PORT = process.env.PORT || 5001;


app.use('/api/transactions', transactionsRoute)

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})