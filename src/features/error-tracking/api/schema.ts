import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const errorLogs = sqliteTable("error_logs", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	message: text("message").notNull(),
	code: text("code").notNull(),
	severity: text("severity").notNull(),
	path: text("path"),
	userId: integer("user_id"),
	metadata: text("metadata"), // JSON stringified metadata
	stack: text("stack"),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const rateLimitErrors = sqliteTable("rate_limit_errors", {
	id: integer("id").primaryKey(),
	errorLogId: integer("error_log_id").references(() => errorLogs.id),
	configKey: text("config_key").notNull(),
	attempts: integer("attempts").notNull(),
	maxAttempts: integer("max_attempts").notNull(),
	resetAt: text("reset_at").notNull(),
	deviceInfo: text("device_info"), // JSON stringified device info
	botConfidence: integer("bot_confidence"),
	botReasons: text("bot_reasons"), // JSON stringified array
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
