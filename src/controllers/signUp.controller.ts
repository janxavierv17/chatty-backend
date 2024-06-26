import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { validateWithZod } from "../shared/globals/decorators";
import { signupSchema } from "../schemas/authentication/signup.schema";
import { IAuthDocument, ISignUpData } from "../interfaces/auth.interface";
import { authService } from "../services/db/auth/auth.service";
import { BadRequestError } from "../shared/globals/errors";
import { Helpers } from "../shared/utils/helpers";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { upload } from "../shared/utils/cloudinary";
import { createLogger } from "../shared/globals/logger";
import HTTP_STATUS from "http-status-codes";
import { redisUser } from "../services/redis/user/user.cache";
import { IUserDocument } from "../interfaces/user.interface";
import { omit } from "lodash";
import { authQueue } from "../services/queues/auth.queue";
import { userQueue } from "../services/queues/user.queue";
import JWT from "jsonwebtoken";

const logger = createLogger("SignUp");
const { CLOUDINARY_NAME, JWT_TOKEN } = process.env;
export class SignUp {
    @validateWithZod(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        logger.debug("[signUpController] - start");

        const { username, email, password, avatarColor, avatarImage } =
            req.body;
        const { signupToken, userData, signUpData } = SignUp.prototype;
        const { getUserByUsernameOrEmail } = authService;

        const existingUser: IAuthDocument = await getUserByUsernameOrEmail(
            username,
            email
        );

        if (existingUser) throw new BadRequestError("Invalid credentials.");

        const authObjectID: ObjectId = new ObjectId();
        const userObjectID: ObjectId = new ObjectId(); // We use this id to make sure we're referring to the same photo and be able to update their avater image.
        const uId: string = `${Helpers.generateRandomIntegers(12)}`;
        const data: ISignUpData = {
            _id: authObjectID,
            uId,
            username,
            email,
            password,
            avatarColor
        };

        const authData: IAuthDocument = signUpData(data);

        const uploadArgs = {
            file: avatarImage,
            public_id: `${userObjectID}`,
            overwrite: true,
            invalidate: true
        };
        const cloudinaryResult: UploadApiResponse | UploadApiErrorResponse =
            await upload(uploadArgs);
        logger.info("Cloudinary result =>", cloudinaryResult);

        if (!cloudinaryResult.public_id)
            throw new BadRequestError("Something went wrong with file upload");

        // Add data to our redis.
        const userDataToCache: IUserDocument = userData(authData, userObjectID);
        userDataToCache.profilePicture = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/v${cloudinaryResult.version}/${userObjectID}`;
        await redisUser.cacheUser(`${userObjectID}`, uId, userDataToCache);

        // Add data to our database.
        authQueue.addToJob("AddAuthUserToDB", { value: authData });
        userQueue.AddToJob("AddUserToDB", {
            value: omit(userDataToCache, [
                "uId",
                "username",
                "avatarColor",
                "password"
            ])
        });

        const userJwt = signupToken(authData, userObjectID);

        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.CREATED).json({
            message: "User create successfully.",
            user: userDataToCache,
            token: userJwt
        });
    }

    // Essentially this method below adjusts username and email value.
    private signUpData(data: ISignUpData): IAuthDocument {
        const { _id, username, email, uId, password, avatarColor } = data;
        return {
            _id,
            uId,
            username: Helpers.firstLetterUppercase(username),
            email: Helpers.lowerCase(email),
            password,
            avatarColor,
            createAt: new Date()
        } as unknown as IAuthDocument;
    }

    private userData(data: IAuthDocument, authId: ObjectId): IUserDocument {
        const { _id, username, email, uId, password, avatarColor } = data;

        return {
            _id: authId,
            authId: _id,
            uId,
            username: Helpers.firstLetterUppercase(username),
            email,
            password,
            avatarColor,
            profilePicture: "",
            blocked: [],
            blockedBy: [],
            work: "",
            location: "",
            school: "",
            quote: "",
            bgImageVersion: "",
            bgImageId: "",
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            notifications: {
                messages: true,
                reactions: true,
                comments: true,
                follows: true
            },
            social: {
                facebook: "",
                instagram: "",
                twitter: "",
                youtube: ""
            }
        } as unknown as IUserDocument;
    }

    private signupToken(data: IAuthDocument, userObjectID: ObjectId): string {
        const { uId, email, username, avatarColor } = data;
        return JWT.sign(
            {
                userId: userObjectID,
                uId,
                email,
                username,
                avatarColor
            },
            JWT_TOKEN
        );
    }
}
