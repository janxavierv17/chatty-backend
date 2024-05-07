import { z } from "zod";
import { createLogger } from "../../shared/globals/logger";

const logger = createLogger("Password Schema");

export const emailSchema = z
    .object({
        email: z.string({ required_error: "Field must be valid" }).email()
    })
    .required();
export const passwordSchema = z
    .object({
        password: z.string({ required_error: "Please enter a valid password" }).min(4).max(8),
        confirmPassword: z.string()
    })
    .required()
    .superRefine(({ password, confirmPassword }, ctx) => {
        logger.debug("Confirm password", { password, confirmPassword });
        if (password !== confirmPassword)
            ctx.addIssue({
                code: "custom",
                message: "Your passwords should match.",
                path: ["confirmPassword"]
            });
    });
