import { Router } from "express";
import { CurrentUser } from "../../controllers/currentUser.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

class UserRoutes {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    public routes(): Router {
        return this.router.get("/user", AuthMiddleware.isAuthenticated, CurrentUser.prototype.read);
    }
}

export const CurrentUserRoutes = new UserRoutes();
