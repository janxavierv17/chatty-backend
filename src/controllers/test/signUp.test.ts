/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as cloudinaryUploads from "../../shared/utils/cloudinary";
import { SignUp } from "../signUp.controller";
import { CustomError } from "../../shared/globals/errors";
import { authMock, authMockRequest, authMockResponse } from "../../mocks/auth.mock";
import { authService } from "../../services/db/auth/auth.service";
import { RedisUser } from "../../services/redis/user/user.cache";
import { ZodError } from "zod";

jest.useFakeTimers();
jest.mock("../../services/queues/base.queue");
jest.mock("../../services/redis/user/user.cache");
jest.mock("../../services/queues/user.queue");
jest.mock("../../services/queues/auth.queue");
jest.mock("../../shared/utils/cloudinary");

describe("SignUp", () => {
    const envs = process.env;
    beforeEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
        process.env = { ...envs }; // Make a copy
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        process.env = envs; // Restore old environment
    });

    it("should throw an error if username is not available", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "",
                email: "manny@test.com",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();

        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe("Invalid name.");
        });
    });

    it("should throw an error if username length is less than minimum length", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "ma",
                email: "manny@test.com",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe("Invalid name.");
        });
    });

    it("should throw an error if username length is greater than maximum length", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "mathematics",
                email: "manny@test.com",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe("Invalid name.");
        });
    });

    it("should throw an error if email is not valid", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "not valid",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();

        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe("Invalid email address");
        });
    });

    it("should throw an error if email is not available", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe("Invalid email address");
        });
    });

    it("should throw an error if password is not available", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "manny@test.com",
                password: "",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe(
                "Invalid password. The length of your password must be 4 to 8 characters."
            );
        });
    });

    it("should throw an error if password length is less than minimum length", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "manny@test.com",
                password: "ma",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();

        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe(
                "Invalid password. The length of your password must be 4 to 8 characters."
            );
        });
    });

    it("should throw an error if password length is greater than maximum length", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "manny@test.com",
                password: "mathematics1",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: ZodError) => {
            expect(error.errors[0].message).toBe(
                "Invalid password. The length of your password must be 4 to 8 characters."
            );
        });
    });

    it("should throw unauthorize error is user already exist", () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "manny@test.com",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();

        jest.spyOn(authService, "getUserByUsernameOrEmail").mockResolvedValue(authMock);
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual("Invalid credentials.");
        });
    });

    it("should set session data for valid credentials and send correct json response", async () => {
        const req: Request = authMockRequest(
            {},
            {
                username: "Manny",
                email: "manny@test.com",
                password: "qwerty",
                avatarColor: "red",
                avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
            }
        ) as Request;
        const res: Response = authMockResponse();

        jest.spyOn(authService, "getUserByUsernameOrEmail").mockResolvedValue(null as any);
        const userSpy = jest.spyOn(RedisUser.prototype, "cacheUser");
        jest.spyOn(cloudinaryUploads, "upload").mockImplementation((): any =>
            Promise.resolve({ version: "1234737373", public_id: "123456" })
        );

        await SignUp.prototype.create(req, res);
        expect(req.session?.jwt).toBeDefined();
        expect(res.json).toHaveBeenCalledWith({
            message: "User create successfully.",
            user: userSpy.mock.calls[0][2],
            token: req.session?.jwt
        });
    });
});
