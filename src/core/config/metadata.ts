import type { Metadata } from "next";

export const siteConfig = {
	name: "ZSH Config Builder",
	description: "Visual editor for ZSH configurations",
	url: process.env.NEXT_PUBLIC_APP_URL,
	author: {
		name: "Remco Stoeten",
		url: "https://remcostoeten.com",
		github: "https://github.com/remcostoeten",
		linkedin: "https://www.linkedin.com/in/remco-stoeten/",
		x: "https://x.com/yowremco",
	},
	repositoryUrl: "https://github.com/remcostoeten/zsh-visual-config-builder",
} as const;

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
	metadataBase: new URL(siteConfig.url || "http://localhost:3000"),
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
} as const;
