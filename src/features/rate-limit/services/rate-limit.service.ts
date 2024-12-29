"use client";

import { createRateLimit, recordAttempt } from "../api/mutations";
import { getRateLimit } from "../api/queries";
import { RATE_LIMIT_CONFIGS, RATE_LIMIT_TYPES } from "../constants";

export type RateLimitConfig = {
	key: keyof typeof RATE_LIMIT_TYPES;
	maxAttempts?: number;
	duration?: number;
	userId?: number;
	identifier?: string;
};

/**
 * Predefined rate limit configurations for common use cases
 */
export const RateLimitPresets = {
	AUTH: {
		key: RATE_LIMIT_TYPES.AUTH,
		...RATE_LIMIT_CONFIGS[RATE_LIMIT_TYPES.AUTH],
	},
	FEEDBACK: {
		key: RATE_LIMIT_TYPES.FEEDBACK,
		...RATE_LIMIT_CONFIGS[RATE_LIMIT_TYPES.FEEDBACK],
	},
	LIKE: {
		key: RATE_LIMIT_TYPES.LIKE,
		...RATE_LIMIT_CONFIGS[RATE_LIMIT_TYPES.LIKE],
	},
	COMMENT: {
		key: RATE_LIMIT_TYPES.COMMENT,
		...RATE_LIMIT_CONFIGS[RATE_LIMIT_TYPES.COMMENT],
	},
	API: {
		key: RATE_LIMIT_TYPES.API,
		...RATE_LIMIT_CONFIGS[RATE_LIMIT_TYPES.API],
	},
} as const;

export class RateLimitService {
	/**
	 * Check and enforce rate limit for a specific action
	 */
	static async checkRateLimit(config: RateLimitConfig): Promise<boolean> {
		const identifier = config.identifier || (await this.getClientIdentifier());
		const rateLimit = await getRateLimit({
			identifier,
			configKey: config.key,
			userId: config.userId,
		});

		// If no rate limit exists, create one
		if (!rateLimit) {
			const preset = RATE_LIMIT_CONFIGS[config.key];
			await createRateLimit({
				identifier,
				configKey: config.key,
				userId: config.userId,
				maxAttempts: config.maxAttempts || preset.maxAttempts,
				duration: config.duration || preset.duration,
			});
			return true;
		}

		// Check if rate limited
		if (
			rateLimit.attempts >=
			(config.maxAttempts || RATE_LIMIT_CONFIGS[config.key].maxAttempts)
		) {
			return false;
		}

		// Record the attempt
		await recordAttempt({
			identifier,
			configKey: config.key,
			userId: config.userId,
		});

		return true;
	}

	/**
	 * Wrap an async function with rate limiting
	 */
	static async withRateLimit<T>(
		config: RateLimitConfig,
		fn: () => Promise<T>,
	): Promise<T> {
		const isAllowed = await this.checkRateLimit(config);

		if (!isAllowed) {
			throw new Error(`Rate limited: ${config.key}`);
		}

		return fn();
	}

	/**
	 * Get a unique identifier for the current client
	 */
	private static async getClientIdentifier(): Promise<string> {
		// In a real implementation, you'd get this from the request context
		return "client-ip-address";
	}
}

// Usage examples:

// 1. Auth rate limiting
export const authWithRateLimit = async (credentials: any) => {
	return RateLimitService.withRateLimit(RateLimitPresets.AUTH, async () => {
		// Your auth logic here
		return { success: true };
	});
};

// 2. Like button rate limiting
export const likeWithRateLimit = async (postId: string) => {
	return RateLimitService.withRateLimit(RateLimitPresets.LIKE, async () => {
		// Your like logic here
		return { success: true };
	});
};

// 3. Custom rate limit
export const customRateLimit = async () => {
	return RateLimitService.withRateLimit(
		{
			key: RATE_LIMIT_TYPES.CUSTOM,
			maxAttempts: 2,
			duration: 24 * 60 * 60 * 1000, // 1 day
		},
		async () => {
			// Your custom logic here
			return { success: true };
		},
	);
};
