import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

redisClient.on("connect", () => {
  console.log("[Redis - dev] Connected to Redis server");
});

redisClient.on("error", (err) => {
  console.error("[Redis - dev] Redis connection error:", err);
});

export default redisClient;
