import { Application } from "express";
import { createLogger } from "../shared/globals/logger";
import { AuthRoutes } from "./auth/auth.routes";

const logger = createLogger("Routes");
const BASE_PATH = "/api/v1";

export default (app: Application) => {
    const routes = () => {
        app.use(BASE_PATH, AuthRoutes.routes());
    };

    routes();
};
