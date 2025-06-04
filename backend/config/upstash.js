import { Redis } from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit'
import 'dotenv/config';

const redis = Redis.fromEnv();
 
const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per 60 seconds
})

export default rateLimiter

