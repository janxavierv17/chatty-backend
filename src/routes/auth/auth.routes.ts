import express, { Router } from "express";
import { SignUp } from "../../controllers/signUp.controller";
import { SignIn } from "../../controllers/signIn.controller";
import { SignOut } from "../../controllers/signOut.controller";
class AuthenticationRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post("/signup", SignUp.prototype.create);
        this.router.post("/signin", SignIn.prototype.read);
        return this.router;
    }

    public signOutRoute(): Router {
        this.router.get("/signout", SignOut.prototype.update);
        return this.router;
    }
}

export const AuthRoutes: AuthenticationRoutes = new AuthenticationRoutes();
