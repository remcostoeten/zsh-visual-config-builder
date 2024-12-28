"use client";

import UserProvider from "@/features/auth/context/user-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<UserProvider>
				{children}
				<Toaster position="top-center" />
			</UserProvider>
		</ThemeProvider>
	);
}
