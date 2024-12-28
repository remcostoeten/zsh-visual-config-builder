import "@/styles/main.css";
import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { geistSans, geistMono } from "@/core/fonts";
import { metadata } from "@/core/config/metadata";
import { AppProvider } from "@/providers/app-provider";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Header } from "@/components/header";

export { metadata };

export default  async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

  let user = null;

  const token = (await cookies()).get('token')?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.userId) {
        const dbUser = await db.select().from(users).where(eq(users.id, payload.userId as number)).get();
        if (dbUser) {
          user = {
            ...dbUser,
            createdAt: dbUser.createdAt ? new Date(dbUser.createdAt) : null
          };
        }
      }
    } catch (error) {
      console.error('Error verifying JWT:', error);
    }
  }
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppProvider>
					<Header user={user ? { ...user, createdAt: user.createdAt ? user.createdAt.toISOString() : null } : null} />
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
