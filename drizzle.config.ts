import { defineConfig } from "drizzle-kit";
import { env } from "./src/server/env";

export default defineConfig({
	schema: "./src/server/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: env.DATABASE_URL ?? "",
		authToken: env.DATABASE_AUTH_TOKEN ?? "",
	},
});
