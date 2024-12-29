import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		DATABASE_AUTH_TOKEN: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		JWT_SECRET: z.string().min(1),
		ADMIN_EMAIL: z.string().min(1),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		JWT_SECRET: process.env.JWT_SECRET,
		ADMIN_EMAIL: process.env.ADMIN_EMAIL,
	},
});
