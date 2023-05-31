import Redis from "ioredis";
// import { isProd } from "~/constants";
// const host = true ? process.env.REDIS_END_POINT : "127.0.0.1";
console.log(process.env.REDIS_END_POINT);
export const redisClient = new Redis.Cluster([
  {
    host: process.env.REDIS_END_POINT,
  },
]);
