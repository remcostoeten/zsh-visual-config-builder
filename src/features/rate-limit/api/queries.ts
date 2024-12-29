import { db } from "@/server/db";
import { rateLimits, rateLimitAttempts } from "@/server/db/schema";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { DURATIONS, BOT_CONFIDENCE_THRESHOLD } from "../constants";

export type GetRateLimitParams = {
	identifier: string;
	configKey: string;
	userId?: number;
};

/**
 * Get current rate limit state for a specific identifier and config
 */
export const getRateLimit = async ({
	identifier,
	configKey,
	userId,
}: GetRateLimitParams) => {
	const conditions = [
		eq(rateLimits.identifier, identifier),
		eq(rateLimits.configKey, configKey),
	];

	if (userId) {
		conditions.push(eq(rateLimits.userId, userId));
	}

	return db.query.rateLimits.findFirst({
		where: and(...conditions),
		with: {
			attempts: {
				orderBy: (attempts, { desc }) => [desc(attempts.createdAt)],
				limit: 1,
			},
		},
	});
};

/**
 * Get all rate limit attempts for analysis
 */
export const getRateLimitAttempts = async (rateLimitId: number) => {
	return db.query.rateLimitAttempts.findMany({
		where: eq(rateLimitAttempts.rateLimitId, rateLimitId),
		orderBy: (attempts, { desc }) => [desc(attempts.createdAt)],
	});
};

/**
 * Get active rate limits that haven't reset yet
 */
export const getActiveRateLimits = async (userId: number) => {
	return db.query.rateLimits.findMany({
		where: and(
			eq(rateLimits.userId, userId),
			gt(rateLimits.resetAt, new Date().toISOString()),
		),
		with: {
			attempts: true,
		},
	});
};

/**
 * Get rate limit statistics for the admin dashboard
 */
export async function getRateLimitStats() {
	const now = new Date();
	const hourAgo = new Date(now.getTime() - DURATIONS.HOUR);
	const dayAgo = new Date(now.getTime() - DURATIONS.DAY);

	// Get active rate limits
	const activeLimits = await db.query.rateLimits.findMany({
		where: gt(rateLimits.resetAt, now.toISOString()),
	});

	// Get active limits from an hour ago for comparison
	const previousActiveLimits = await db.query.rateLimits.findMany({
		where: and(
			gt(rateLimits.resetAt, hourAgo.toISOString()),
			eq(rateLimits.createdAt, hourAgo.toISOString()),
		),
	});

	// Get bot attempts in the last hour
	const botAttempts = await db.query.rateLimitAttempts.findMany({
		where: and(gt(rateLimitAttempts.createdAt, hourAgo.toISOString())),
	});

	// Get previous hour's bot attempts for comparison
	const previousBotAttempts = await db.query.rateLimitAttempts.findMany({
		where: and(gt(rateLimitAttempts.createdAt, dayAgo.toISOString())),
	});

	// Get unique users in the last day
	const uniqueUsers = await db
		.select({
			count: sql<number>`COUNT(DISTINCT ${rateLimits.identifier})`,
		})
		.from(rateLimits)
		.where(gt(rateLimits.createdAt, dayAgo.toISOString()));

	// Get top rate limited endpoints
	const topEndpoints = await db
		.select({
			configKey: rateLimits.configKey,
			attempts: sql<number>`COUNT(*)`,
		})
		.from(rateLimits)
		.where(gt(rateLimits.createdAt, dayAgo.toISOString()))
		.groupBy(rateLimits.configKey)
		.orderBy(sql`COUNT(*) DESC`)
		.limit(5);

	// Get geographic distribution
	const geoDistribution = await db
		.select({
			country: rateLimitAttempts.country,
			attempts: sql<number>`COUNT(*)`,
		})
		.from(rateLimitAttempts)
		.where(gt(rateLimitAttempts.createdAt, dayAgo.toISOString()))
		.groupBy(rateLimitAttempts.country)
		.orderBy(sql`COUNT(*) DESC`)
		.limit(5);

	// Calculate percentage changes
	const activeChange = calculatePercentageChange(
		previousActiveLimits.length,
		activeLimits.length,
	);

	const botAttemptsChange = calculatePercentageChange(
		previousBotAttempts.length,
		botAttempts.length,
	);

	return {
		activeLimits: activeLimits.length,
		activeChange,
		botAttempts: botAttempts.length,
		botAttemptsChange,
		uniqueUsers: uniqueUsers[0]?.count || 0,
		topEndpoints: await Promise.all(
			topEndpoints.map(async (endpoint) => ({
				...endpoint,
				change: await calculateEndpointChange(endpoint.configKey, dayAgo),
			})),
		),
		geoDistribution: geoDistribution.map((geo) => ({
			...geo,
			percentage: Math.round((geo.attempts / botAttempts.length) * 100),
		})),
	};
}

/**
 * Get rate limit trends for the last 24 hours
 */
export async function getRateLimitTrends() {
	const now = new Date();
	const dayAgo = new Date(now.getTime() - DURATIONS.DAY);

	// Get hourly data points for the last 24 hours
	const hours = Array.from({ length: 24 }, (_, i) => {
		const date = new Date(now.getTime() - i * DURATIONS.HOUR);
		return date.toISOString();
	}).reverse();

	return Promise.all(
		hours.map(async (hour) => {
			const nextHour = new Date(
				new Date(hour).getTime() + DURATIONS.HOUR,
			).toISOString();

			// Get total attempts for this hour
			const [attempts] = await db
				.select({
					count: sql<number>`COUNT(*)`,
				})
				.from(rateLimits)
				.where(
					and(
						gt(rateLimits.createdAt, hour),
						sql`${rateLimits.createdAt} <= ${nextHour}`,
					),
				);

			// Get bot attempts for this hour
			const [botAttempts] = await db
				.select({
					count: sql<number>`COUNT(*)`,
				})
				.from(rateLimitAttempts)
				.where(
					and(
						gt(rateLimitAttempts.createdAt, hour),
						sql`${rateLimitAttempts.createdAt} <= ${nextHour}`,
					),
				);

			return {
				time: new Date(hour).toLocaleTimeString(),
				attempts: attempts.count,
				botAttempts: botAttempts.count,
			};
		}),
	);
}

function calculatePercentageChange(previous: number, current: number): number {
	if (previous === 0) return 100;
	return Math.round(((current - previous) / previous) * 100);
}

async function calculateEndpointChange(
	configKey: string,
	dayAgo: Date,
): Promise<number> {
	const previousDay = new Date(dayAgo.getTime() - DURATIONS.DAY);

	const [current, previous] = await Promise.all([
		db
			.select({ count: sql<number>`COUNT(*)` })
			.from(rateLimits)
			.where(
				and(
					eq(rateLimits.configKey, configKey),
					gt(rateLimits.createdAt, dayAgo.toISOString()),
				),
			),
		db
			.select({ count: sql<number>`COUNT(*)` })
			.from(rateLimits)
			.where(
				and(
					eq(rateLimits.configKey, configKey),
					gt(rateLimits.createdAt, previousDay.toISOString()),
					sql`${rateLimits.createdAt} <= ${dayAgo.toISOString()}`,
				),
			),
	]);

	return calculatePercentageChange(
		previous[0]?.count || 0,
		current[0]?.count || 0,
	);
}
