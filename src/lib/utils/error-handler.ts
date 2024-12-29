"use client";

type ErrorSeverity = "low" | "medium" | "high" | "critical";

type ErrorContext = {
	userId?: string | number;
	path?: string;
	timestamp?: string;
	metadata?: Record<string, any>;
};

export class AppError extends Error {
	public severity: ErrorSeverity;
	public context: ErrorContext;
	public code: string;

	constructor(
		message: string,
		code: string,
		severity: ErrorSeverity = "medium",
		context: ErrorContext = {},
	) {
		super(message);
		this.name = "AppError";
		this.severity = severity;
		this.code = code;
		this.context = {
			...context,
			timestamp: new Date().toISOString(),
			path: typeof window !== "undefined" ? window.location.pathname : "",
		};
	}
}

export class RateLimitError extends AppError {
	constructor(message: string, context: ErrorContext = {}) {
		super(message, "RATE_LIMIT_ERROR", "medium", context);
		this.name = "RateLimitError";
	}
}

export class DeviceInfoError extends AppError {
	constructor(message: string, context: ErrorContext = {}) {
		super(message, "DEVICE_INFO_ERROR", "low", context);
		this.name = "DeviceInfoError";
	}
}

/**
 * Central error handler that can be extended with various reporting services
 */
export const handleError = async (
	error: Error | AppError,
	context: ErrorContext = {},
) => {
	const errorToLog =
		error instanceof AppError
			? error
			: new AppError(error.message, "UNKNOWN_ERROR", "medium", context);

	// In development, log to console
	if (process.env.NODE_ENV === "development") {
		console.error("Error:", {
			name: errorToLog.name,
			message: errorToLog.message,
			code: (errorToLog as AppError).code,
			severity: (errorToLog as AppError).severity,
			context: (errorToLog as AppError).context,
			stack: errorToLog.stack,
		});
	}

	// In production, you might want to send to error tracking service
	if (process.env.NODE_ENV === "production") {
		// Example: Send to error tracking service
		try {
			await fetch("/api/error-tracking", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: errorToLog.name,
					message: errorToLog.message,
					code: (errorToLog as AppError).code,
					severity: (errorToLog as AppError).severity,
					context: (errorToLog as AppError).context,
					stack: errorToLog.stack,
				}),
			});
		} catch (e) {
			// Fallback to console in case tracking fails
			console.error("Failed to track error:", e);
		}
	}

	return errorToLog;
};
