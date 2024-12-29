import "@/styles/main.css";
import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { primaryFont, secondaryFont, monoFont } from "@/core/fonts";
import { metadata } from "@/core/config/metadata";
import { AppProvider } from "@/providers/app-provider";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/server/env";
import Header from "@/components/header";

export { metadata };

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let user = null;

	const token = (await cookies()).get("token")?.value;

	if (token) {
		try {
			const secret = new TextEncoder().encode(env.JWT_SECRET);
			const { payload } = await jwtVerify(token, secret);

			if (payload.userId) {
				const dbUser = await db
					.select()
					.from(users)
					.where(eq(users.id, payload.userId as number))
					.get();
				if (dbUser) {
					user = {
						...dbUser,
						createdAt: dbUser.createdAt ? new Date(dbUser.createdAt) : null,
					};
				}
			}
		} catch (error) {
			console.error("Error verifying JWT:", error);
		}
	}
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${primaryFont.variable} ${secondaryFont.variable} ${monoFont.variable} antialiased h-[200vh]`}
			>
				<AppProvider>
					<Header
						user={
							user
								? {
										...user,
										createdAt: user.createdAt
											? user.createdAt.toISOString()
											: null,
									}
								: null
						}
					/>
					{children}
				</AppProvider>
			</body>
		</html>
	);
}
