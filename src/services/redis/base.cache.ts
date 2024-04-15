import { createClient } from "redis";
import { createLogger } from "../../shared/globals/logger";

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
    redis: RedisClient;
    logger;

    constructor(cacheName: string) {
        this.redis = createClient();
        this.logger = createLogger(cacheName);

        this.onError();
    }

    private onError(): void {
        this.redis.on("error", (error) => this.logger.error(error));
    }
}
