import Redis from "ioredis";

export const redisClient = new Redis({
  host: "127.0.0.1",
});
