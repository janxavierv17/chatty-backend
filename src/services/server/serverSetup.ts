/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Application,
    json,
    urlencoded,
    Response,
    Request,
    NextFunction
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
import applicationRoutes from "../../routes";
import { createLogger } from "../../shared/globals/logger";
import { CustomError, IErrorResponse } from "../../shared/globals/errors";
import { ZodError } from "zod";

const SERVER_PORT = 3001;
const logger = createLogger("Server");

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
        const secure = NODE_ENV !== "development"; // set to true when deploying to different environment

        app.use(
            cookieSession({
                name: "session",
                maxAge: sevenDays,
                keys,
                secure
            })
        );

        // hpp protects our app against http request parameter pollution attacks
        // bypassing input validation or DDOS
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: "*",
                credentials: true,
                optionsSuccessStatus: 200,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            })
        );
    }

    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: "50mb" }));
        app.use(urlencoded({ extended: true, limit: "50mb" }));
    }

    private routesMiddleware(app: Application): void {
        applicationRoutes(app);
    }

    // Catch error where an endpoint does not exist.
    private globalErrorHandler(app: Application): void {
        app.all("*", (req: Request, res: Response) => {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `${req.originalUrl} does not exist.`
            });
        });

        app.use(
            (
                err: IErrorResponse,
                req: Request,
                res: Response,
                next: NextFunction
            ): void => {
                if (err instanceof ZodError)
                    res.status(HTTP_STATUS.BAD_REQUEST).json(err.errors);

                if (err instanceof CustomError)
                    res.status(err.statusCode)
                        .json(err.serializeErrors())
                        .end();

                next();
            }
        );
    }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            const socketIO: Server = await this.createSocketIO(httpServer);

            this.startHttpServer(httpServer);
            this.socketIOConnections(socketIO);
            logger.info("Successfully connected to our redis.");
        } catch (err) {
            logger.error("Something went wrong at start server: ", err);
        }
    }

    // Ensure that the redis server is running
    // Command to run redis server is redis-server
    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        try {
            const { CLIENT_URL, REDIS_HOST } = process.env;
            const io: Server = new Server(httpServer, {
                cors: {
                    origin: CLIENT_URL,
                    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
                }
            });
            const pubClient = createClient({ url: REDIS_HOST });
            const subClient = pubClient.duplicate();

            await Promise.all([pubClient.connect(), subClient.connect()]);
            io.adapter(createAdapter(pubClient, subClient));

            return io;
        } catch (err) {
            logger.error("Create Socket IO faced an error: ", err);
            throw err;
        }
    }

    private startHttpServer(httpServer: http.Server): void {
        logger.info(`Server has started with a process of ${process.pid}`);

        // Do not use logger.info in production.
        httpServer.listen(SERVER_PORT, () =>
            logger.info(`Server listening on port ${SERVER_PORT}`)
        );
    }

    private socketIOConnections(io: Server): void {}
}
