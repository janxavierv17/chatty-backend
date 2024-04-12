import { z } from "zod";

export const signupSchema = z
    .object({
        username: z
            .string({
                required_error: "A valid name is required.",
                invalid_type_error: "A name must be a string."
            })
            .min(4, "Invalid name.")
            .max(8, "Invalid name."),
        password: z
            .string({
                required_error: "A valid password is required.",
                invalid_type_error: "A passwordword must be a string."
            })
            .min(
                4,
                "Invalid password. The length of your password must be 4 to 8 characters."
            )
            .max(
                8,
                "Invalid password. The length of your password must be 4 to 8 characters."
            ),
        email: z
            .string({
                required_error: "A valid email address is required.",
                invalid_type_error: "Your email address must be valid."
            })
            .email({ message: "Invalid email address" }),
        avatarColor: z.string({
            required_error: "Please choose an avatar color"
        }),
        avatarImage: z.string({
            required_error: "Please include any image.",
            invalid_type_error: "Please include a valid image."
        })
    })
    .required();
