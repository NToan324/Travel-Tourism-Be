import { createClient, type RedisClientType } from "redis";

import { InternalServerError } from "@/core/error.response";

export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.initializeClient();
  }

  private initializeClient() {
    this.client.on("connect", () => console.log("[Redis] Connected"));
    this.client.on("error", (error) => {
      console.error("[Redis] Connection error:", error);
    });

    void this.client.connect().catch((error) => {
      console.error("[Redis] Failed to connect:", error);
      throw new InternalServerError("Failed to connect to Redis");
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      console.error("[RedisService] set error:", error);
      throw new InternalServerError("Failed to set value in Redis");
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("[RedisService] get error:", error);
      throw new InternalServerError("Failed to get value from Redis");
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      console.log("[Redis] Disconnected");
    } catch (error) {
      console.error("[Redis] Disconnection error:", error);
    }
  }
}
