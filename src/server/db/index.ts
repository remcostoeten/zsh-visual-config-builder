import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { env } from "../env";

// This ensures the code only runs on the server side
const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Export a type safe client
export type DbClient = typeof db;

// Ensure this file is only imported on the server side
if (typeof window !== 'undefined') {
	throw new Error('This module can only be imported on the server side');
}
