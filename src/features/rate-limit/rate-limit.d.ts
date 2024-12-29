export interface RateLimitConfig {
	key: string;
	maxAttempts: number;
	duration: number;
	scope: "user" | "ip" | "device";
}

export interface UseRateLimitProps {
	config: RateLimitConfig;
	identifier?: string;
	onRateLimited?: () => void;
}

export interface UseRateLimitReturn {
	isRateLimited: boolean;
	remaining: number;
	resetAt: Date | null;
	attempt: () => Promise<boolean>;
	deviceInfo: any;
}
