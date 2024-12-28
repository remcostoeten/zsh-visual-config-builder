import "./globals.css";
import { AppProvider } from "@/components/theme-provider";
import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { geistSans, geistMono } from "@/core/fonts";
import { metadata } from "@/core/config/metadata";

export { metadata };

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppProvider>
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
