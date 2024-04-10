import { z } from "zod";
import express, { Express } from "express";
import { env_variables } from "./shared/globals/index";
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
        const app: Express = express();
        const server: ChattyServer = new ChattyServer(app);
        server.start();
    }
}

const application: Application = new Application();
application.initialize();
