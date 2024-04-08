import { MongoClient, ServerApiVersion } from "mongodb";
import { createLogger } from "../../shared/globals/logger.ts";

const logger = createLogger("database");

const { DATABASE_URL } = process.env;

const client = new MongoClient(DATABASE_URL, {
    monitorCommands: true,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export default () => {
    const connect = () => {
        client
            .connect()
            .then(() => logger.info("Successfully connected to our MongoDB."))
            .catch((err) => {
                logger.error(`Something went wrong ${err}`);
                client.close();
                return process.exit(1);
            });

        client
            .db("admin")
            .command({ ping: 1 })
            .then((payload) =>
                logger.info("Successfully pinged our db.", payload)
            )
            .catch((err) =>
                logger.error(`Pinged db but an error occured ${err}`)
            );
    };
    connect();
};
