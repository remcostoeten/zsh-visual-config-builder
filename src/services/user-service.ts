import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function findUserByGithubId(githubId: string) {
	return db.query.users.findFirst({
		where: eq(users.githubId, githubId),
	});
}

export async function createUser(userData: {
	githubId: string;
	name: string;
	email: string;
	avatarUrl?: string;
}) {
	const [newUser] = await db.insert(users).values(userData).returning();
	return newUser;
}

export async function updateUserRole(userId: string, role: string) {
	const [updatedUser] = await db
		.update(users)
		.set({ role })
		.where(eq(users.id, Number.parseInt(userId, 10)))
		.returning();
	return updatedUser;
}
