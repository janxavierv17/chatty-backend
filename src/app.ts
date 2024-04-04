import { z } from "zod";
import express, { Express } from "express";
import { ChattyServer } from "./services/server/index.ts";
import connectDatabase from "./services/db/index.ts";
import { env_variables } from "./shared/globals/";
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
