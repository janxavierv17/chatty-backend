import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../interfaces/auth.interface";
import { NotAuthorizedError } from "../shared/globals/errors";
import { createLogger } from "../shared/globals/logger";
import JWT from "jsonwebtoken";

const { JWT_TOKEN } = process.env;
const logger = createLogger("AuthMiddleware");
class AuthenticationMiddleware {
    // Check if the user's jwt session is valid
    public isUserValid(req: Request, res: Response, next: NextFunction): void {
        if (!req.session) throw new NotAuthorizedError("Please log in.");
        try {
            const payload: AuthPayload = JWT.verify(req.session.jwt, JWT_TOKEN) as AuthPayload;
            req.currentUser = payload;
        } catch (err) {
            logger.error(err);
            throw new NotAuthorizedError("Invalid token, please login again");
        }
        next();
    }

    public isAuthenticated(req: Request, res: Response, next: NextFunction): void {
        if (!req.currentUser) throw new NotAuthorizedError("Authentication is required.");
        next();
    }
}

export const AuthMiddleware = new AuthenticationMiddleware();
