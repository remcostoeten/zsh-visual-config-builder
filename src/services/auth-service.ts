"use server";

import { env } from "@/server/env";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { GithubUser } from "@/features/auth/types";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const APP_URL = env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;

export async function getUser(): Promise<GithubUser | null> {
	const cookieStore = await cookies();
	const sessionId = (await cookieStore.get("sessionId"))?.value;

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

	return {
		id: session.user.id,
		login: session.user.name || "",
		email: session.user.email,
		avatar_url: session.user.avatarUrl || ""
	};
}

export async function loginWithGitHub(): Promise<string> {
	// Generate a random state
	const state = randomBytes(16).toString("hex");
	
	// Store the state in a cookie
	const cookieStore = await cookies();
	await cookieStore.set("oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 10 // 10 minutes
	});

	// Ensure callback URL is properly formatted
	const callbackUrl = new URL("/api/auth/callback", APP_URL).toString();
	console.log("Callback URL:", callbackUrl); // For debugging

	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: callbackUrl,
		scope: "read:user user:email",
		state
	});

	return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function logout(): Promise<void> {
	const cookieStore = await cookies();
	const sessionId = (await cookieStore.get("sessionId"))?.value;

	if (sessionId) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		await cookieStore.delete("sessionId");
	}
}
