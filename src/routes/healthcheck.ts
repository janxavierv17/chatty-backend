import express, { Router } from "express";
import HTTP_STATUS from "http-status-codes";
import { createLogger } from "../shared/globals/logger";

const logger = createLogger("HealthCheck");
class HealthRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public healthCheck(): Router {
        logger.info("[healthCheck] - start");
        this.router.get("/healthcheck", (req, res) =>
            res.status(HTTP_STATUS.OK).send(`Server instance is health with process id ${process.pid}`)
        );

        logger.info("[healthCheck] - end");
        return this.router;
    }
}

export const HealthCheckRoutes = new HealthRoutes();
