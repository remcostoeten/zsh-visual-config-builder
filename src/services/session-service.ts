// services/session-service.ts
import { cookies } from "next/headers";
import { db } from "db";
import { sessions, users } from "schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function getSession() {
  const sessionId = (await cookies()).get("sessionId")?.value;
  if (!sessionId) return null;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: { user: true },
  });

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session;
}

export async function createSession(userId: number) {
  const sessionId = nanoid();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  (await cookies()).set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
  });
}

export async function deleteSession() {
  const sessionId = (await cookies()).get("sessionId")?.value;
  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    (await cookies()).delete("sessionId");
  }
}
