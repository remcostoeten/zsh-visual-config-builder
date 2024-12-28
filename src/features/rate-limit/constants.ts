/**
 * Constants for rate limiting various actions in the application.
 */
export const RATE_LIMIT = {
  LOGIN: {
    MAX_ATTEMPTS: 5,
    WINDOW_MINUTES: 15,
    LOCKOUT_MINUTES: 30,
  },
  LIKE_ACTION: {
    COOLDOWN_DAYS: 7,
  },
} as const;

/**
 * Storage keys used for tracking rate limit data.
 */
export const STORAGE_KEYS = {
  LOGIN_ATTEMPTS: 'login-attempts',
  LIKE_ACTIONS: 'like-actions',
  APP_FEEDBACK: 'app-feedback',
} as const; 