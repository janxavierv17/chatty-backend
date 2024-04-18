import { Request, Response } from "express";
import { redisUser } from "../services/redis/user/user.cache";
import { userService } from "../services/db/user/user.service";
import HTTP_STATUS from "http-status-codes";
import { createLogger } from "../shared/globals/logger";

const logger = createLogger("CurrentUser");
export class CurrentUser {
    public async read(req: Request, res: Response): Promise<void> {
        logger.info("[CurrentUser.read] - start");
        let isUser = false;
        let token = null;

        const userFromCache = await redisUser.getUserFromCache(`${req.currentUser!.userId}`);
        const existingUser = userFromCache
            ? userFromCache
            : await userService.getUserByID(`${req.currentUser!.userId}`);

        if (Object.keys(existingUser).length) {
            isUser = true;
            token = req.session!.jwt;
        }

        logger.info("[CurrentUser.read] - end");
        res.status(HTTP_STATUS.OK).json({ token, isUser, user: existingUser });
    }
}
