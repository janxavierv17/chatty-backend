import {
    v2 as cloudinary,
    UploadApiResponse,
    UploadApiErrorResponse
} from "cloudinary";
import { createLogger } from "../globals/logger";

const logger = createLogger("Cloudinary");

type imageType = "png" | "jpeg";
type Base64<imageType extends string> =
    `data:image/${imageType};base64${string}`;

export const upload = (
    file: Base64<imageType>,
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
