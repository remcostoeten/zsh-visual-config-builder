import { useState, useEffect } from "react";
import { UseRateLimitProps, UseRateLimitReturn } from "../types";
import { getDeviceInfo } from "../utils/device-info";

/**
 * Interface representing the state of rate limiting for a specific user/action
 */
type RateLimitState = {
	attempts: number;
	lastAttempt: string | null;
	resetAt: string | null;
	deviceInfo: any;
};

/**
 * Custom hook for implementing rate limiting functionality
 * @param {Object} props - The hook's properties
 * @param {Object} props.config - Configuration object for rate limiting
 * @param {number} props.config.maxAttempts - Maximum number of attempts allowed
 * @param {number} props.config.duration - Duration in milliseconds before rate limit resets
 * @param {string} props.config.key - Unique identifier for this rate limit configuration
 * @param {string} props.identifier - Unique identifier for the user/session (defaults to "demo-user")
 * @param {Function} props.onRateLimited - Callback function triggered when rate limit is reached
 * @returns {Object} Rate limit state and control functions
 * @returns {boolean} .isRateLimited - Whether the rate limit has been reached
 * @returns {number} .remaining - Number of attempts remaining
 * @returns {Date|null} .resetAt - When the rate limit will reset
 * @returns {Function} .attempt - Function to record a new attempt
 * @returns {Object} .deviceInfo - Information about the user's device
 */
export const useRateLimit = ({
	config,
	identifier = "demo-user",
	onRateLimited,
}: UseRateLimitProps): UseRateLimitReturn => {
	const storageKey = `rate-limit-${config.key}-${identifier}`;

	const getStoredState = (): RateLimitState => {
		const stored = localStorage.getItem(storageKey);
		if (!stored)
			return {
				attempts: 0,
				lastAttempt: null,
				resetAt: null,
				deviceInfo: null,
			};
		return JSON.parse(stored);
	};

	const [attempts, setAttempts] = useState(() => getStoredState().attempts);
	const [lastAttempt, setLastAttempt] = useState<Date | null>(() => {
		const stored = getStoredState().lastAttempt;
		return stored ? new Date(stored) : null;
	});
	const [resetAt, setResetAt] = useState<Date | null>(() => {
		const stored = getStoredState().resetAt;
		return stored ? new Date(stored) : null;
	});
	const [deviceInfo, setDeviceInfo] = useState(getStoredState().deviceInfo);

	useEffect(() => {
		const state = getStoredState();
		if (state.resetAt) {
			const resetAtDate = new Date(state.resetAt);
			if (resetAtDate > new Date()) {
				setAttempts(state.attempts);
				setLastAttempt(state.lastAttempt ? new Date(state.lastAttempt) : null);
				setResetAt(resetAtDate);
				setDeviceInfo(state.deviceInfo);
			} else {
				localStorage.removeItem(storageKey);
				setAttempts(0);
				setLastAttempt(null);
				setResetAt(null);
				setDeviceInfo(null);
			}
		}
	}, [storageKey]);

	const isRateLimited = attempts >= config.maxAttempts;

	const attempt = async (): Promise<boolean> => {
		if (isRateLimited) {
			onRateLimited?.();
			return false;
		}

		const newAttempts = attempts + 1;
		const now = new Date();
		const newResetAt = new Date(now.getTime() + config.duration);
		const newDeviceInfo = await getDeviceInfo();

		// Calculate time between attempts
		if (lastAttempt) {
			newDeviceInfo.timeBetweenAttempts = now.getTime() - lastAttempt.getTime();
		}

		setAttempts(newAttempts);
		setLastAttempt(now);
		setResetAt(newResetAt);
		setDeviceInfo(newDeviceInfo);

		localStorage.setItem(
			storageKey,
			JSON.stringify({
				attempts: newAttempts,
				lastAttempt: now.toISOString(),
				resetAt: newResetAt.toISOString(),
				deviceInfo: newDeviceInfo,
			}),
		);

		if (newAttempts >= config.maxAttempts) {
			onRateLimited?.();
		}

		return true;
	};

	return {
		isRateLimited,
		remaining: Math.max(0, config.maxAttempts - attempts),
		resetAt,
		attempt,
		deviceInfo,
	};
};
