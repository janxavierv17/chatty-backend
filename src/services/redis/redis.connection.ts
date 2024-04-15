import { createLogger } from "../../shared/globals/logger";
import { BaseCache } from "./base.cache";

const logger = createLogger("Redis");

class RedisConnection extends BaseCache {
    constructor() {
        super("RedisBaseCache");
    }

    async connect(): Promise<void> {
        try {
            await this.redis.connect();
            const redisPing = await this.redis.ping();
            logger.info("Pinged redis and have responded with", redisPing);
        } catch (err) {
            logger.error(err);
        }
    }
}

export const redisConnection = new RedisConnection();
