"use server";

import { env } from "@/server/env";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { GithubUser } from "@/features/auth/types";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { User } from "@/server/db/schema";

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;

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

	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: new URL("/api/auth/callback", env.APP_URL).toString(),
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

interface RegisterData {
	email: string;
	password: string;
	name: string;
}

interface LoginData {
	email: string;
	password: string;
}

export async function register(data: RegisterData): Promise<User> {
	const response = await fetch('/api/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to register');
	}

	return response.json();
}

export async function login(data: LoginData): Promise<User> {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to login');
	}

	return response.json();
}

export async function resetPassword(email: string): Promise<void> {
	const response = await fetch('/api/auth/reset-password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to request password reset');
	}
}

export async function verifyEmail(token: string): Promise<void> {
	const response = await fetch(`/api/auth/verify-email?token=${token}`, {
		method: 'POST',
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to verify email');
	}
}
