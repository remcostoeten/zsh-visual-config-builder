import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        verificationToken,
      })
      .returning();

    // TODO: Send verification email
    // For now, we'll just return the user
    
    // Remove sensitive data before returning
    const { password: _, verificationToken: __, ...safeUser } = user;
    
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 