import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const githubId = searchParams.get("githubId");

  if (!githubId) {
    return NextResponse.json({ error: "GitHub ID is required" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.githubId, githubId),
  });

  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const userData = await request.json();

  if (!userData.githubId || !userData.name || !userData.email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const [newUser] = await db.insert(users).values(userData).returning();
  return NextResponse.json(newUser);
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { role } = await request.json();

  if (!userId || !role) {
    return NextResponse.json(
      { error: "User ID and role are required" },
      { status: 400 }
    );
  }

  const [updatedUser] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, Number.parseInt(userId, 10)))
    .returning();

  return NextResponse.json(updatedUser);
} 