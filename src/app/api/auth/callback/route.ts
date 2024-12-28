import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(GITHUB_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/login?error=no_access_token', request.url));
    }

    // Fetch user data from GitHub
    const userResponse = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Check if user exists in database, if not create new user
    let user = await db.select().from(users).where(eq(users.githubId, userData.id.toString())).get();

    if (!user) {
      user = await db.insert(users).values({
        githubId: userData.id.toString(),
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatar_url,
      }).returning().get();
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    // Set cookie and redirect to home page
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Error in GitHub OAuth callback:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}


