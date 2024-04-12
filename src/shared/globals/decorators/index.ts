/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateWithZod = (schema: z.ZodType) => {
    return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;
        descriptor.value = async function (
            ...args: [Request, Response, NextFunction]
        ) {
            const [req] = args;
            // Throws an error which our global handler will handle.
            schema.parse(req.body);
            return method.apply(this, args);
        };

        return descriptor;
    };
};
