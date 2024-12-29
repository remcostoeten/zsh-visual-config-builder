import { RateLimitError } from "@/lib/utils/error-handler";

type RateLimitContext = {
	attempts: number;
	maxAttempts: number;
	resetAt: Date;
	configKey: string;
	deviceInfo?: any;
};

/**
 * Generate user-friendly error messages for rate limiting
 */
export const getRateLimitMessage = (context: RateLimitContext): string => {
	const timeLeft = Math.ceil(
		(context.resetAt.getTime() - Date.now()) / 1000 / 60,
	);
	const attemptsLeft = Math.max(0, context.maxAttempts - context.attempts);

	switch (context.configKey) {
		case "auth":
			return attemptsLeft > 0
				? `Too many login attempts. ${attemptsLeft} attempts remaining. Please try again in ${timeLeft} minutes.`
				: `Account temporarily locked. Please try again in ${timeLeft} minutes or contact support.`;

		case "feedback":
			return `You've already submitted feedback. You can submit again in ${timeLeft} minutes.`;

		case "like-button":
			return `You've already interacted with this item. Please wait ${timeLeft} minutes before trying again.`;

		default:
			return `Rate limit reached. Please try again in ${timeLeft} minutes.`;
	}
};

/**
 * Generate detailed error objects with appropriate context
 */
export const createRateLimitError = (
	context: RateLimitContext,
	botInfo?: { isBot: boolean; confidence: number; reasons: string[] },
): RateLimitError => {
	const message = getRateLimitMessage(context);
	const severity = context.configKey === "auth" ? "high" : "medium";

	// If it's a bot with high confidence, create a more severe error
	if (botInfo?.isBot && botInfo.confidence > 0.8) {
		return new RateLimitError("Automated access detected and blocked", {
			metadata: {
				botConfidence: botInfo.confidence,
				botReasons: botInfo.reasons,
				...context,
			},
			userId: context.deviceInfo?.userId,
		});
	}

	return new RateLimitError(message, {
		metadata: {
			attemptsLeft: Math.max(0, context.maxAttempts - context.attempts),
			timeLeft: Math.ceil((context.resetAt.getTime() - Date.now()) / 1000),
			isBot: botInfo?.isBot,
			...context,
		},
		userId: context.deviceInfo?.userId,
	});
};

/**
 * Get appropriate HTTP status code for rate limit errors
 */
export const getRateLimitStatusCode = (context: RateLimitContext): number => {
	// Use 429 for normal rate limits
	if (!context.deviceInfo?.isBot) return 429;

	// Use 403 for suspected bots
	return 403;
};
