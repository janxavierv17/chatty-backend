import mongoose from "mongoose";
import { createLogger } from "../../shared/globals/logger";
import { redisConnection } from "../redis/redis.connection";

const logger = createLogger("Database");
const { DATABASE_URL } = process.env;

export const connectDatabase = () => {
    const connect = async () => {
        try {
            await mongoose.connect(`${DATABASE_URL}`, { dbName: "chatty" });
            redisConnection.connect();
            logger.info("Successfully connected to MongoDB");
        } catch (err) {
            logger.error("Something went wrong with connecting to our database.", err);
            return process.exit(1);
        }
    };
    connect();
    mongoose.connection.on("disconnected", connect);
};
