import { db } from "@/server/db";
import { rateLimitEvents } from "./schema";
import { UAParser } from "ua-parser-js";
import { nanoid } from "nanoid";

interface RateLimitEventData {
  type: string;
  userId?: string;
  userEmail?: string;
  identifier: string;
  attemptCount: number;
  windowStartedAt: Date;
  lockedUntil?: Date;
  ipAddress?: string;
  userAgent: string;
  targetResource?: string;
  additionalData?: Record<string, unknown>;
}

export class RateLimitEventService {
  private async getLocationData(ipAddress?: string) {
    if (!ipAddress) return null;
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city,
        latitude: data.latitude?.toString(),
        longitude: data.longitude?.toString(),
      };
    } catch (error) {
      console.error("Failed to fetch location data:", error);
      return null;
    }
  }

  private analyzeDeviceInfo(userAgent: string) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Determine device type
    let deviceType = "desktop";
    if (result.device.type === "mobile") deviceType = "mobile";
    if (result.device.type === "tablet") deviceType = "tablet";

    return {
      deviceType,
      deviceInfo: {
        vendor: result.device.vendor || "unknown",
        model: result.device.model || "unknown",
        type: result.device.type || "desktop",
      },
      operatingSystem: result.os.name || "unknown",
      browser: result.browser.name || "unknown",
      browserVersion: result.browser.version || "unknown",
    };
  }

  private calculateAutomationScore(data: RateLimitEventData): number {
    let score = 0;

    // Factor 1: Time between attempts
    const avgTimeBetweenAttempts = data.additionalData?.timeBetweenAttempts as number;
    if (avgTimeBetweenAttempts && avgTimeBetweenAttempts < 1000) score += 30;
    else if (avgTimeBetweenAttempts && avgTimeBetweenAttempts < 2000) score += 15;

    // Factor 2: Number of attempts
    if (data.attemptCount > 10) score += 30;
    else if (data.attemptCount > 5) score += 15;

    // Factor 3: Session duration vs attempts
    const sessionDuration = data.additionalData?.sessionDuration as number;
    if (sessionDuration && (data.attemptCount / sessionDuration) > 0.5) score += 40;

    return Math.min(score, 100);
  }

  async logRateLimitEvent(data: RateLimitEventData) {
    const deviceInfo = this.analyzeDeviceInfo(data.userAgent);
    const locationData = await this.getLocationData(data.ipAddress);
    const automationScore = this.calculateAutomationScore(data);

    await db.insert(rateLimitEvents).values({
      id: nanoid(),
      type: data.type,
      userId: data.userId,
      userEmail: data.userEmail,
      identifier: data.identifier,
      attemptCount: data.attemptCount,
      windowStartedAt: data.windowStartedAt,
      lockedUntil: data.lockedUntil,
      isStillLocked: !!data.lockedUntil && data.lockedUntil > new Date(),
      
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      ...deviceInfo,
      
      ...locationData,
      
      sessionDuration: data.additionalData?.sessionDuration as number,
      timeBetweenAttempts: data.additionalData?.timeBetweenAttempts as number,
      seemsAutomated: automationScore > 70,
      automationScore,
      
      targetResource: data.targetResource,
      additionalData: data.additionalData || {},
    });
  }

  async getActiveRateLimits() {
    return db.query.rateLimitEvents.findMany({
      where: (fields, { eq }) => eq(fields.isStillLocked, true),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    });
  }

  async getRateLimitHistory(limit = 100) {
    return db.query.rateLimitEvents.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      limit,
    });
  }

  async getRateLimitsByUser(userId: string) {
    return db.query.rateLimitEvents.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    });
  }
} 