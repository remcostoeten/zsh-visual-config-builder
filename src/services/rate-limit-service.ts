import { RATE_LIMIT, STORAGE_KEYS } from '@/features/rate-limit/constants';
import { RateLimitEventService } from '@/features/rate-limit/server/service';

interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
  sessionStartTime?: number;
  attemptTimes?: number[];
}

interface ActionRecord {
  lastAction: number;
  identifier: string;
}

export class RateLimitService {
  private storage: Storage | undefined;
  private eventService: RateLimitEventService;

  constructor() {
    if (typeof window !== 'undefined') {
      this.storage = window.localStorage;
    }
    this.eventService = new RateLimitEventService();
  }

  private getRecord(key: string): RateLimitRecord | null {
    if (!this.storage) return null;
    const data = this.storage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setRecord(key: string, record: RateLimitRecord | ActionRecord): void {
    if (!this.storage) return;
    this.storage.setItem(key, JSON.stringify(record));
  }

  private generateIdentifier(): string {
    // Combine various browser fingerprinting factors
    const userAgent = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const raw = `${userAgent}|${screenRes}|${timeZone}`;
    
    // Create a hash of the combined string
    return Array.from(new TextEncoder().encode(raw))
      .reduce((hash, byte) => ((hash << 5) - hash) + byte, 0)
      .toString(36);
  }

  async checkLoginAttempt(userId: string, userEmail?: string): Promise<{ allowed: boolean; waitTime: number }> {
    const key = `${STORAGE_KEYS.LOGIN_ATTEMPTS}-${userId}`;
    const record = this.getRecord(key) || {
      attempts: 0,
      lastAttempt: 0,
      sessionStartTime: Date.now(),
      attemptTimes: [],
    };
    const now = Date.now();

    // Update attempt times
    record.attemptTimes = [...(record.attemptTimes || []), now];

    // Check if currently locked out
    if (record.lockedUntil && record.lockedUntil > now) {
      await this.eventService.logRateLimitEvent({
        type: 'login',
        userId,
        userEmail,
        identifier: this.generateIdentifier(),
        attemptCount: record.attempts,
        windowStartedAt: new Date(record.sessionStartTime || now),
        lockedUntil: new Date(record.lockedUntil),
        userAgent: navigator.userAgent,
        targetResource: 'login',
        additionalData: {
          sessionDuration: (now - (record.sessionStartTime || now)) / 1000,
          timeBetweenAttempts: record.attemptTimes && record.attemptTimes.length > 1
            ? average(differences(record.attemptTimes))
            : null,
        },
      });
      return { allowed: false, waitTime: record.lockedUntil - now };
    }

    // Reset attempts if window has passed
    const windowMs = RATE_LIMIT.LOGIN.WINDOW_MINUTES * 60 * 1000;
    if (now - record.lastAttempt > windowMs) {
      record.attempts = 0;
      record.sessionStartTime = now;
      record.attemptTimes = [now];
    }

    // Check if max attempts reached
    if (record.attempts >= RATE_LIMIT.LOGIN.MAX_ATTEMPTS) {
      const lockoutMs = RATE_LIMIT.LOGIN.LOCKOUT_MINUTES * 60 * 1000;
      record.lockedUntil = now + lockoutMs;
      this.setRecord(key, record);

      await this.eventService.logRateLimitEvent({
        type: 'login',
        userId,
        userEmail,
        identifier: this.generateIdentifier(),
        attemptCount: record.attempts,
        windowStartedAt: new Date(record.sessionStartTime || now),
        lockedUntil: new Date(record.lockedUntil),
        userAgent: navigator.userAgent,
        targetResource: 'login',
        additionalData: {
          sessionDuration: (now - (record.sessionStartTime || now)) / 1000,
          timeBetweenAttempts: record.attemptTimes && record.attemptTimes.length > 1
            ? average(differences(record.attemptTimes))
            : null,
        },
      });

      return { allowed: false, waitTime: lockoutMs };
    }

    // Allow attempt and update record
    record.attempts += 1;
    record.lastAttempt = now;
    this.setRecord(key, record);
    return { allowed: true, waitTime: 0 };
  }

  async checkActionLimit(actionId: string, userId?: string, userEmail?: string): Promise<{ allowed: boolean; waitTime: number }> {
    if (!this.storage) return { allowed: false, waitTime: 0 };

    const identifier = this.generateIdentifier();
    const key = `${STORAGE_KEYS.LIKE_ACTIONS}-${actionId}`;
    const record = this.getRecord(key) as ActionRecord | null;
    const now = Date.now();

    if (record) {
      const cooldownMs = RATE_LIMIT.LIKE_ACTION.COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      const timeLeft = (record.lastAction + cooldownMs) - now;
      
      if (timeLeft > 0 && record.identifier === identifier) {
        await this.eventService.logRateLimitEvent({
          type: 'action',
          userId,
          userEmail,
          identifier,
          attemptCount: 1,
          windowStartedAt: new Date(record.lastAction),
          lockedUntil: new Date(record.lastAction + cooldownMs),
          userAgent: navigator.userAgent,
          targetResource: actionId,
          additionalData: {
            actionType: 'like',
          },
        });
        return { allowed: false, waitTime: timeLeft };
      }
    }

    this.setRecord(key, { lastAction: now, identifier });
    return { allowed: true, waitTime: 0 };
  }

  resetLoginAttempts(userId: string): void {
    const key = `${STORAGE_KEYS.LOGIN_ATTEMPTS}-${userId}`;
    this.storage?.removeItem(key);
  }
}

// Utility functions
function differences(arr: number[]): number[] {
  return arr.slice(1).map((num, i) => num - arr[i]);
}

function average(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
} 