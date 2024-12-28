import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/server/env";
import { createSession } from "@/services/session-service";
import { getGithubAccessToken, getGithubUser } from "@/features/auth/api/github";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const cookieStore = await cookies();
    const savedState = (await cookieStore.get("oauth_state"))?.value;

    if (!code || !state || state !== savedState) {
      return NextResponse.redirect(new URL("/login?error=invalid_request", request.url));
    }

    // Clear state cookie
    await cookieStore.delete("oauth_state");

    // Exchange code for access token
    const accessToken = await getGithubAccessToken(code);
    
    // Get GitHub user data
    const githubUser = await getGithubUser(accessToken);

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.githubId, githubUser.id.toString()),
    });

    if (!user) {
      const [newUser] = await db.insert(users)
        .values({
          githubId: githubUser.id.toString(),
          email: githubUser.email,
          name: githubUser.login,
          avatarUrl: githubUser.avatar_url,
        })
        .returning();
      user = newUser;
    }

    // Create session
    await createSession(user.id);

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", request.url));
  }
} 