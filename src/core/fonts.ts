import { Outfit, Space_Grotesk, JetBrains_Mono } from "next/font/google";

export const primaryFont = Outfit({
	variable: "--font-primary",
	subsets: ["latin"],
	display: 'swap',
});

export const secondaryFont = Space_Grotesk({
	variable: "--font-secondary",
	subsets: ["latin"],
	display: 'swap',
});

export const monoFont = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	display: 'swap',
});
