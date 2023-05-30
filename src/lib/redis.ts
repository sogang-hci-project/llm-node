import Redis from "ioredis";
import { isProd } from "~/constants";
const host = isProd ? process.env.REDIS_END_POINT : "127.0.0.1";
console.log(process.env.REDIS_END_POINT);
export const redisClient = new Redis({
  host,
});
