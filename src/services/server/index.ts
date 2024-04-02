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
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import compression from "compression";

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
		// AWS load balancer will use the name 'session'
		// Cookies are renewed whenever user logs out and logs back in.
		const sevenDays = 24 * 7 * 3600000;
		app.use(
			cookieSession({
				name: "session",
				keys: ["test1", "test2"],
				maxAge: sevenDays,
				secure: false, // set to true when deploying to different environment
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
			this.startHttpServer(httpServer);
		} catch (err) {
			console.error(`Something went wrong at start server ${err}`);
		}
	}

	private createSocketIO(httpServer: http.Server): void {}

	private startHttpServer(httpServer: http.Server): void {
		// Do not use console.log in production.
		httpServer.listen(SERVER_PORT, () =>
			console.log(`Server listening on port ${SERVER_PORT}`)
		);
	}
}
