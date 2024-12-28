import { db } from "db";
import { users } from "schema";
import { eq } from "drizzle-orm";

export async function findUserByGithubId(githubId: string) {
  return db.query.users.findFirst({
    where: eq(users.githubId, githubId),
  });
}

export async function createUser(userData: {
  githubId: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
}) {
  const [newUser] = await db.insert(users).values(userData).returning();
  return newUser;
}
