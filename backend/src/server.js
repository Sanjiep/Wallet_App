import express from 'express';
import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import ratelimiterMiddleware from './middleware/ratelimiter.js';
import job from './config/cron.js';

const app = express();

if (process.env.NODE_ENV === "production") job.start(); // Start the cron job to send GET request every 14 minutes

app.use(express.json()); // Middleware to parse JSON bodies
app.use(ratelimiterMiddleware) // Apply rate limiting middleware
import transactionsRoute from './routes/transactionsRoute.js';

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
})


app.use('/api/transactions', transactionsRoute)

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})