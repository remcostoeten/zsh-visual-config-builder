import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@/server/db";
import { users, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check email verification
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }

    // Create session
    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionToken,
        userId: user.id,
        expiresAt,
      })
      .returning();

    // Set session cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "session",
      value: session.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
} 