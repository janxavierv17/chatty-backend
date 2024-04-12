import { z } from "zod";

export const signinSchema = z
    .object({
        username: z
            .string({
                required_error: "Please enter your email address."
            })
            .min(4, "Invalid username.")
            .max(8, "Invalid username"),
        password: z
            .string({ required_error: "Please enter your password." })
            .min(4, "Invalid password.")
            .max(8, "Invalid password.")
    })
    .required();
