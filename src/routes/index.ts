import { Application } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { serverAdapter } from "../services/queues/base.queue";

const BASE_PATH = "/api/v1";

export default (app: Application) => {
    const routes = () => {
        // Bull's GUI to see if there the job
        app.use("/queues", serverAdapter.getRouter());
        app.use(BASE_PATH, AuthRoutes.routes());
        app.use(BASE_PATH, AuthRoutes.signOutRoute());
    };

    routes();
};
