import { z } from "zod";
import express, { Express } from "express";
import { env_variables, config } from "./shared/globals/config";
import { ChattyServer } from "./services/server/serverSetup";
import { connectDatabase } from "./services/db/db";
declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof env_variables> {}
    }
}

export class Application {
    public initialize(): void {
        connectDatabase();
        this.loadConfigurations();

        const app: Express = express();
        const server: ChattyServer = new ChattyServer(app);
        server.start();
    }

    private loadConfigurations(): void {
        config.cloudinary();
    }
}

const application: Application = new Application();
application.initialize();
