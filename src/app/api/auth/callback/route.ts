import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");

	if (!code) {
		console.error("No code provided in callback");
		return NextResponse.redirect(new URL("/login?error=no_code", request.url));
	}

	try {
		console.log("Starting GitHub OAuth callback flow");
		
		// Exchange code for access token
		console.log("Exchanging code for access token...");
		const tokenResponse = await fetch(GITHUB_ACCESS_TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code,
			}),
		});

		const tokenData = await tokenResponse.json();
		console.log("Token response received:", { hasToken: !!tokenData.access_token });

		if (!tokenData.access_token) {
			console.error("No access token in response:", tokenData);
			return NextResponse.redirect(
				new URL("/login?error=no_access_token", request.url),
			);
		}

		// Fetch user data from GitHub
		console.log("Fetching user data from GitHub...");
		const userResponse = await fetch(GITHUB_USER_URL, {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
			},
		});

		const userData = await userResponse.json();
		console.log("GitHub user data received:", {
			id: userData.id,
			hasEmail: !!userData.email,
			hasName: !!userData.name,
		});

		// Check if user exists in database, if not create new user
		console.log("Looking up user in database...");
		let user = await db
			.select()
			.from(users)
			.where(eq(users.githubId, userData.id.toString()))
			.get();

		if (!user) {
			console.log("Creating new user...");
			user = await db
				.insert(users)
				.values({
					githubId: userData.id.toString(),
					email: userData.email,
					name: userData.name,
					avatarUrl: userData.avatar_url,
				})
				.returning()
				.get();
			console.log("New user created:", { userId: user.id });
		} else {
			console.log("Existing user found:", { userId: user.id });
		}

		// Create session
		console.log("Creating new session...");
		const sessionId = nanoid();
		const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

		await db.insert(sessions).values({
			id: sessionId,
			userId: user.id,
			expiresAt,
		});
		console.log("Session created:", { sessionId, expiresAt: new Date(expiresAt) });

		// Set cookie and redirect to home page
		const response = NextResponse.redirect(new URL("/", request.url));
		response.cookies.set("sessionId", sessionId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			expires: new Date(expiresAt),
			path: "/",
		});
		console.log("Cookie set and redirecting to home");

		return response;
	} catch (error) {
		console.error("Error in GitHub OAuth callback:", error);
		return NextResponse.redirect(
			new URL("/login?error=server_error", request.url),
		);
	}
}
