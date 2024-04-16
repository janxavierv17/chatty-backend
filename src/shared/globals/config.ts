import { z } from "zod";
import {
    v2 as cloudinary,
    UploadApiResponse,
    UploadApiErrorResponse
} from "cloudinary";
import { createLogger } from "./logger";

// Include type safety to our process.env
export const env_variables = z.object({
    PORT: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.string(),
    CLIENT_URL: z.string(),
    SECRET_COOKIE_ONE: z.string(),
    SECRET_COOKIE_TWO: z.string(),
    REDIS_HOST: z.string(),
    CLOUDINARY_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    CLOUDINARY_ENV_VARIABLE: z.string(),
    JWT_TOKEN: z.string()
});
env_variables.parse(process.env);

const logger = createLogger("Config");

class Config {
    public cloudinary(): void {
        logger.info("Loading config");
        const {
            CLOUDINARY_NAME: cloud_name,
            CLOUDINARY_API_KEY: api_key,
            CLOUDINARY_API_SECRET: api_secret
        } = process.env;

        cloudinary.config({
            cloud_name,
            api_key,
            api_secret
        });
        logger.info("Successfully configured cloudinary");
    }
}

export const config: Config = new Config();

// type imageType = "png" | "jpeg";

// type Base64<imageType extends string> =
//     `data:image/${imageType};base64${string}`;

// file: Base64<imageType>,

export const upload = (
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    const config = { public_id, overwrite, invalidate };
    const callback = (
        err: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
    ) => {
        if (err) logger.error(err);
        if (result) logger.info(result);
    };

    const uploader = cloudinary.uploader.upload(file, config, callback);
    return uploader;
};
