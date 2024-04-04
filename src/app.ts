import express, { Express } from "express";
import { ChattyServer } from "./services/server/index.ts";
import connectDatabase from "./services/db/index.ts";

import { z } from "zod";

// Include type safety to our process.env
const env = z.object({
	PORT: z.string(),
	DATABASE_URL: z.string(),
	NODE_ENV: z.string(),
	CLIENT_URL: z.string(),
	SECRET_COOKIE_ONE: z.string(),
	SECRET_COOKIE_TWO: z.string(),
});

env.parse(process.env);
declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof env> {}
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
