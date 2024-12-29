"use client";

import { useState } from "react";
import {
	RateLimitService,
	RateLimitPresets,
} from "@/features/rate-limit/services/rate-limit.service";
import { RateLimitMessage } from "@/features/rate-limit/components/rate-limitted-alert";

export type AuthFormProps = {
	// ... existing props
};

export default function AuthForm({/* ... existing props */}: AuthFormProps) {
	const [isRateLimited, setIsRateLimited] = useState(false);
	const [rateLimitResetAt, setRateLimitResetAt] = useState<Date | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await RateLimitService.withRateLimit(RateLimitPresets.AUTH, async () => {
				// Your existing auth logic here
				// await signIn(...);
			});

			// Reset rate limit state on success
			setIsRateLimited(false);
			setRateLimitResetAt(null);
		} catch (error) {
			if (error instanceof Error && error.message.includes("Rate limited")) {
				setIsRateLimited(true);
				// Set reset time to 15 minutes from now (matching AUTH preset)
				setRateLimitResetAt(new Date(Date.now() + 15 * 60 * 1000));
			} else {
				// Handle other errors
				console.error("Auth error:", error);
			}
		}
	};

	return (
		<div className="relative">
			<form onSubmit={handleSubmit}>{/* Your existing form fields */}</form>

			{isRateLimited && (
				<RateLimitMessage
					resetAt={rateLimitResetAt}
					variant="inline"
					onDismiss={() => setIsRateLimited(false)}
				/>
			)}
		</div>
	);
}
