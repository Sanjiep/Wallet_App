import rateLimiter from "../config/upstash.js";

const ratelimiterMiddleware = async (req, res, next) => {
    try {
        // const key = req.ip || "global";
        const { success } = await rateLimiter.limit("my-rate-limit");

        if (!success) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
        }
        next();
    } catch (error) {
        console.error('Error in rate limiter middleware:', error);
        next(error); // Pass the error to the next middleware
    }
}

export default ratelimiterMiddleware;