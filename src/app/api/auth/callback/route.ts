import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/server/env";
import { createSession } from "@/services/session-service";

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const accessTokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );

  const accessTokenData = await accessTokenResponse.json();
  const accessToken = accessTokenData.access_token;

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userData = await userResponse.json();

  let user = await db.query.users.findFirst({
    where: eq(users.githubId, userData.id.toString()),
  });

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        githubId: userData.id.toString(),
        email: userData.email,
        avatarUrl: userData.avatar_url,
        name: userData.login,
      })
      .returning();
    user = newUser;
  }

  await createSession(user.id);

  return NextResponse.redirect(new URL("/", request.url));
}
