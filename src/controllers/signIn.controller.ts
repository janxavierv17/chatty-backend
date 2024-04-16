import { Request, Response } from "express";
import { authService } from "../services/db/auth/auth.service";
import HTTP_STATUS from "http-status-codes";
import { validateWithZod } from "../shared/globals/decorators";
import { signinSchema } from "../schemas/authentication/signin.schema";
import { BadRequestError } from "../shared/globals/errors";
import JWT from "jsonwebtoken";
import { IUserDocument } from "../interfaces/user.interface";
import { userService } from "../services/db/user/user.service";

const { JWT_TOKEN } = process.env;
export class SignIn {
    @validateWithZod(signinSchema)
    public async read(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        const { getUserByUsernameOrEmail } = authService;

        const existingUser = await getUserByUsernameOrEmail(username);
        if (!existingUser) throw new BadRequestError("Invalid credentials.");

        const passwordMatched = await existingUser.comparePassword(password);
        if (!passwordMatched) throw new BadRequestError("Invalid credentials.");

        const user: IUserDocument = await userService.getUserByAuthID(
            `${existingUser._id}`
        );

        const {
            _id,
            uId,
            email,
            username: userName,
            avatarColor,
            createdAt
        } = existingUser;
        const userJwt: string = JWT.sign(
            { userId: user._id, uId, email, username: userName, avatarColor },
            JWT_TOKEN
        );

        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.OK).json({
            message: "User logged in successfully.",
            user: {
                ...user,
                authId: _id,
                uId,
                username,
                userName,
                email,
                avatarColor,
                createdAt
            },
            token: userJwt
        });
    }
}
