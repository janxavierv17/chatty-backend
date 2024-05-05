import { Application } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { CurrentUserRoutes } from "./user/user.routes";
import { serverAdapter } from "../services/queues/base.queue";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HealthCheckRoutes } from "./healthcheck";

const BASE_PATH = "/api/v1";
export default (app: Application) => {
    const routes = () => {
        // Bull's GUI to see if there the job
        app.use("/queues", serverAdapter.getRouter());
        app.use(HealthCheckRoutes.healthCheck());
        app.use(HealthCheckRoutes.env());

        app.use(BASE_PATH, AuthRoutes.routes());
        app.use(BASE_PATH, AuthRoutes.signOutRoute());

        // Add the middleware here.
        app.use(BASE_PATH, AuthMiddleware.isUserValid, CurrentUserRoutes.routes());
    };

    routes();
};
