import "@/styles/main.css";
import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { geistSans, geistMono } from "@/core/fonts";
import { metadata } from "@/core/config/metadata";
import { AppProvider } from "@/providers/app-provider";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Header } from "@/components/header";
import type { User } from "@/server/db/schema";

export { metadata };

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let user: User | null = null;

	try {
		const cookieStore = cookies();
		const sessionId = cookieStore.get('sessionId')?.value;
		console.log('Layout: Checking session', { hasSessionId: Boolean(sessionId) });

		if (sessionId) {
			const session = await db.query.sessions.findFirst({
				where: eq(sessions.id, sessionId),
				with: {
					user: true
				}
			});

			const now = Date.now();
			const isExpired = session?.expiresAt ? session.expiresAt < now : true;
			
			console.log('Layout: Session lookup result', { 
				hasSession: Boolean(session),
				isExpired,
				hasUser: Boolean(session?.user)
			});

			if (session && !isExpired && session.user) {
				user = {
					...session.user,
					createdAt: session.user.createdAt ? session.user.createdAt : null
				};
			}
		}
	} catch (error) {
		console.error('Error getting user session:', error);
	}

	return (
		<html lang="en" data-color-scheme="dark" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AppProvider>
					<Header user={user} />
					<header className="flex justify-between items-center p-4 border-b">
						<h1 className="text-xl font-bold">ZSH Config Builder</h1>
						<AuthWrapper />
					</header>
					{children}
				</AppProvider>
			</body>
		</html>
	);
}
