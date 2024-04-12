import express, { Router } from "express";
import { SignUp } from "../../controllers/signUp.controller";

class AuthenticationRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post("/signup", SignUp.prototype.create);
        return this.router;
    }
}

export const AuthRoutes: AuthenticationRoutes = new AuthenticationRoutes();
