import { db } from "@/server/db";
import { rateLimits, rateLimitAttempts } from "@/server/db/schema";
import { getDeviceInfo } from "../utils/device-info";
import { getRateLimit } from "./queries";
import { eq, like, or, desc } from "drizzle-orm";

export type CreateRateLimitParams = {
	identifier: string;
	configKey: string;
	userId?: number;
	maxAttempts: number;
	duration: number; // in milliseconds
};

export type RecordAttemptParams = {
	identifier: string;
	configKey: string;
	userId?: number;
};

/**
 * Get all rate limits with optional search
 */
export const getRateLimits = async (search?: string) => {
	let query = db.select().from(rateLimits);

	if (search) {
		query = query.where(
			or(
				like(rateLimits.identifier, `%${search}%`),
				like(rateLimits.configKey, `%${search}%`),
			),
		);
	}

	return query.orderBy(desc(rateLimits.createdAt));
};

/**
 * Create or update a rate limit entry
 */
export const createRateLimit = async ({
	identifier,
	configKey,
	userId,
	maxAttempts,
	duration,
}: CreateRateLimitParams) => {
	const resetAt = new Date(Date.now() + duration).toISOString();

	return db
		.insert(rateLimits)
		.values({
			identifier,
			configKey,
			userId,
			attempts: 1,
			resetAt,
		})
		.returning();
};

/**
 * Record a new attempt and update rate limit state
 */
export const recordAttempt = async ({
	identifier,
	configKey,
	userId,
}: RecordAttemptParams) => {
	const rateLimit = await getRateLimit({ identifier, configKey, userId });
	const deviceInfo = await getDeviceInfo();

	if (!rateLimit) {
		throw new Error("Rate limit not found");
	}

	// Update attempts count
	await db
		.update(rateLimits)
		.set({
			attempts: rateLimit.attempts + 1,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(rateLimits.id, rateLimit.id));

	// Record attempt with device info
	return db
		.insert(rateLimitAttempts)
		.values({
			rateLimitId: rateLimit.id,
			userAgent: deviceInfo.userAgent,
			browser: deviceInfo.browser,
			browserVersion: deviceInfo.browserVersion,
			os: deviceInfo.os,
			osVersion: deviceInfo.osVersion,
			device: deviceInfo.device,
			deviceType: deviceInfo.deviceType,
			ip: deviceInfo.ip,
			timeBetweenAttempts: deviceInfo.timeBetweenAttempts,
			country: deviceInfo.country,
			region: deviceInfo.region,
			city: deviceInfo.city,
			latitude: deviceInfo.latitude,
			longitude: deviceInfo.longitude,
			timezone: deviceInfo.timezone,
			isp: deviceInfo.isp,
			asn: deviceInfo.asn,
			isProxy: deviceInfo.isProxy ? 1 : 0,
			isVpn: deviceInfo.isVpn ? 1 : 0,
			isTor: deviceInfo.isTor ? 1 : 0,
		})
		.returning();
};

/**
 * Reset a rate limit entry
 */
export const resetRateLimit = async (rateLimitId: number) => {
	return db
		.update(rateLimits)
		.set({
			attempts: 0,
			resetAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
		.where(eq(rateLimits.id, rateLimitId))
		.returning();
};
