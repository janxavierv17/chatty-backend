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

const logger = createLogger("SignUp");
export class SignUp {
    @validateWithZod(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        logger.debug("[signUpController] - start");
        const { username, email, password, avatarColor, avatarImage } =
            req.body;

        const existingUser: IAuthDocument =
            await authService.getUserByUsernameOrEmail(username, email);

        if (existingUser) throw new BadRequestError("Invalid credentials.");

        const authObjectId: ObjectId = new ObjectId();
        const userObjectID: ObjectId = new ObjectId(); // We use this id to make sure we're referring to the same photo and be able to update their avater image.
        const uId: string = `${Helpers.generateRandomIntegers(12)}`;
        const data: ISignUpData = {
            _id: authObjectId,
            uId,
            username,
            email,
            password,
            avatarColor
        };

        const authData: IAuthDocument = SignUp.prototype.signUpData(data);

        const uploadArgs = {
            file: avatarImage,
            public_id: `${userObjectID}`,
            overwrite: true,
            invalidate: true
        };
        const cloudinaryResult: UploadApiResponse | UploadApiErrorResponse =
            await upload(uploadArgs);
        logger.info("Cloudinary result =>", cloudinaryResult);

        res.status(HTTP_STATUS.CREATED).json({
            message: "User create successfully.",
            authData
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
}
