import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	githubId: text("github_id").notNull().unique(),
	email: text("email").notNull(),
	name: text("name"),
	avatarUrl: text("avatar_url"),
	role: text("role").default("user").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
