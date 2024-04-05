import { z } from "zod";

// Include type safety to our process.env
export const env_variables = z.object({
	PORT: z.string(),
	DATABASE_URL: z.string(),
	NODE_ENV: z.string(),
	CLIENT_URL: z.string(),
	SECRET_COOKIE_ONE: z.string(),
	SECRET_COOKIE_TWO: z.string(),
	REDIS_HOST: z.string(),
});
env_variables.parse(process.env);
