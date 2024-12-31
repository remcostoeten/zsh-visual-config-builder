"use client";

import UserProvider from "@/features/auth/context/user-context";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<UserProvider>
				{children}
				<Toaster position="top-center" />
			</UserProvider>
		</NextThemesProvider>
	);
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
