import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 5,
  duration: 5
})

export default async function rateLimiter(request: Request, response: Response, Next: NextFunction):Promise<void> {
  try {
    await limiter.consume(request.ip)

    return Next();
  } catch (err) {
    throw new AppError('Too many requests', 429)
  }
}
