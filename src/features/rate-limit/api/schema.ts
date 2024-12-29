import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "@/server/db/schema";

/**
 * Main rate limit table to track attempt counts and timing
 */
export const rateLimits = sqliteTable("rate_limits", {
	id: integer("id").primaryKey(),
	userId: integer("user_id").references(() => users.id),
	identifier: text("identifier").notNull(), // can be user id, session id, or IP
	configKey: text("config_key").notNull(), // which rate limit configuration this belongs to
	attempts: integer("attempts").notNull().default(0),
	lastAttempt: text("last_attempt").default(sql`CURRENT_TIMESTAMP`),
	resetAt: text("reset_at").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Detailed tracking of each rate limit attempt with device and geo info
 */
export const rateLimitAttempts = sqliteTable("rate_limit_attempts", {
	id: integer("id").primaryKey(),
	rateLimitId: integer("rate_limit_id")
		.notNull()
		.references(() => rateLimits.id),
	// Device Info
	userAgent: text("user_agent"),
	browser: text("browser"),
	browserVersion: text("browser_version"),
	os: text("os"),
	osVersion: text("os_version"),
	device: text("device"),
	deviceType: text("device_type"),

	// Network Info
	ip: text("ip"),
	timeBetweenAttempts: integer("time_between_attempts"),

	// Geo Info
	country: text("country"),
	region: text("region"),
	city: text("city"),
	latitude: text("latitude"),
	longitude: text("longitude"),
	timezone: text("timezone"),
	isp: text("isp"),
	asn: text("asn"),

	// Security Info
	isProxy: integer("is_proxy").default(0),
	isVpn: integer("is_vpn").default(0),
	isTor: integer("is_tor").default(0),

	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Relations configuration
 */
export const rateLimitsRelations = relations(rateLimits, ({ many, one }) => ({
	attempts: many(rateLimitAttempts),
	user: one(users, {
		fields: [rateLimits.userId],
		references: [users.id],
	}),
}));

export const rateLimitAttemptsRelations = relations(
	rateLimitAttempts,
	({ one }) => ({
		rateLimit: one(rateLimits, {
			fields: [rateLimitAttempts.rateLimitId],
			references: [rateLimits.id],
		}),
	}),
);

export type RateLimit = typeof rateLimits.$inferSelect;
export type RateLimitAttempt = typeof rateLimitAttempts.$inferSelect;
