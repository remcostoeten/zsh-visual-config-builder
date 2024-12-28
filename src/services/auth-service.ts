"use server";

import { env } from "@/server/env";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { User } from "@/server/db/schema";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;

export async function getUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const sessionId = cookieStore.get("sessionId")?.value;

	if (!sessionId) {
		return null;
	}

	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, sessionId),
		with: {
			user: true
		}
	});

	if (!session || session.expiresAt < Date.now() || !session.user) {
		return null;
	}

	return session.user;
}

export async function loginWithGitHub(): Promise<string> {
	// Generate a random state
	const state = randomBytes(16).toString("hex");
	
	// Store the state in a cookie
	const cookieStore = cookies();
	cookieStore.set("oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 10 // 10 minutes
	});

	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: new URL("/api/auth/callback", env.APP_URL).toString(),
		scope: "read:user user:email",
		state
	});

	return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function logout(): Promise<void> {
	const cookieStore = cookies();
	const sessionId = cookieStore.get("sessionId")?.value;

	if (sessionId) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		cookieStore.delete("sessionId");
	}
}
