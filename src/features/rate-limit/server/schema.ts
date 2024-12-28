import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const rateLimitEvents = pgTable("rate_limit_events", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Rate Limit Info
  type: text("type").notNull(), // 'login' | 'like' | etc.
  userId: text("user_id"), // If authenticated
  userEmail: text("user_email"), // If authenticated
  identifier: text("identifier").notNull(), // Browser fingerprint
  attemptCount: integer("attempt_count").notNull(),
  windowStartedAt: timestamp("window_started_at").notNull(),
  lockedUntil: timestamp("locked_until"),
  isStillLocked: boolean("is_still_locked").notNull(),
  
  // Request Context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent").notNull(),
  deviceType: text("device_type").notNull(), // 'desktop' | 'tablet' | 'mobile'
  deviceInfo: jsonb("device_info").notNull(), // Detailed device info
  operatingSystem: text("operating_system").notNull(),
  browser: text("browser").notNull(),
  browserVersion: text("browser_version").notNull(),
  
  // Location Data
  country: text("country"),
  city: text("city"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  
  // Behavioral Analysis
  sessionDuration: integer("session_duration"), // In seconds
  timeBetweenAttempts: integer("time_between_attempts"), // Average time in ms
  seemsAutomated: boolean("seems_automated").notNull(),
  automationScore: integer("automation_score").notNull(), // 0-100
  
  // Additional Context
  targetResource: text("target_resource"), // What they tried to access
  additionalData: jsonb("additional_data"),
}); 