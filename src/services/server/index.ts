import {
	Application,
	json,
	urlencoded,
	Response,
	Request,
	NextFunction,
} from "express";

import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import "express-async-errors";
import compression from "compression";
import HTTP_STATUS from "http-status-codes";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const SERVER_PORT = 3001;

// Contains start up code
// setupServer.ts
export class ChattyServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		const { SECRET_COOKIE_ONE, SECRET_COOKIE_TWO, NODE_ENV } = process.env;

		// AWS load balancer will use the name 'session'
		// Cookies are renewed whenever user logs out and logs back in.
		const sevenDays = 24 * 7 * 3600000;
		const keys = [SECRET_COOKIE_ONE, SECRET_COOKIE_TWO];
		const secure = NODE_ENV.toLocaleLowerCase() !== "development"; // set to true when deploying to different environment

		app.use(
			cookieSession({
				name: "session",
				maxAge: sevenDays,
				keys,
				secure,
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: "*",
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			})
		);
	}

	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: "50mb" }));
		app.use(urlencoded({ extended: true, limit: "50mb" }));
	}

	private routesMiddleware(app: Application): void {}

	private globalErrorHandler(app: Application): void {}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.createSocketIO(httpServer);

			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (err) {
			console.log(`Something went wrong at start server ${err}`);
		}
	}

	private async createSocketIO(httpServer: http.Server): Promise<Server> {
		try {
			const { CLIENT_URL, REDIS_HOST } = process.env;
			const io: Server = new Server(httpServer, {
				cors: {
					origin: CLIENT_URL,
					methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
				},
			});
			const pubClient = createClient({ url: REDIS_HOST });
			const subClient = pubClient.duplicate();

			await Promise.all([pubClient.connect(), subClient.connect()]);
			io.adapter(createAdapter(pubClient, subClient));

			return io;
		} catch (err) {
			console.error(`Create Socket IO faced an error ${err}`);
			throw err;
		}
	}

	private startHttpServer(httpServer: http.Server): void {
		console.log(`Server has started with a process of ${process.pid}`);

		// Do not use console.log in production.
		httpServer.listen(SERVER_PORT, () =>
			console.log(`Server listening on port ${SERVER_PORT}`)
		);
	}

	private socketIOConnections(io: Server): void {}
}
