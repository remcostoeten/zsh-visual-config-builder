export const DURATIONS = {
	MINUTE: 60 * 1000,
	HOUR: 60 * 60 * 1000,
	DAY: 24 * 60 * 60 * 1000,
	WEEK: 7 * 24 * 60 * 60 * 1000,
	MONTH: 30 * 24 * 60 * 60 * 1000,
	YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

export const BOT_CONFIDENCE_THRESHOLD = 50; // percentage

export const RATE_LIMIT_TYPES = {
	AUTH: "auth",
	FEEDBACK: "feedback",
	LIKE: "like-button",
	COMMENT: "comment",
	API: "api",
} as const;

export const RATE_LIMIT_CONFIGS = {
	[RATE_LIMIT_TYPES.AUTH]: {
		maxAttempts: 4,
		duration: DURATIONS.MINUTE * 15, // 15 minutes
	},
	[RATE_LIMIT_TYPES.FEEDBACK]: {
		maxAttempts: 1,
		duration: DURATIONS.YEAR, // 1 year
	},
	[RATE_LIMIT_TYPES.LIKE]: {
		maxAttempts: 1,
		duration: DURATIONS.MONTH, // 30 days
	},
	[RATE_LIMIT_TYPES.COMMENT]: {
		maxAttempts: 5,
		duration: DURATIONS.MINUTE * 5, // 5 minutes
	},
	[RATE_LIMIT_TYPES.API]: {
		maxAttempts: 100,
		duration: DURATIONS.HOUR, // 1 hour
	},
} as const;
