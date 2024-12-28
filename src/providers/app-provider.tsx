import UserProvider from "@/features/auth/context/user-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function AppProvider({ children }: PageProps) {
	return (
		<ThemeProvider>
			<UserProvider>
				{children}
				<Toaster position="top-center" />
			</UserProvider>
		</ThemeProvider>
	);
}
