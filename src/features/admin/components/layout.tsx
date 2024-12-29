"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

type AdminLayoutProps = {
	children: React.ReactNode;
};

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminLayout({ children }: AdminLayoutProps) {
	const router = useRouter();

	// Add authorization check
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/auth/check-admin");
				const data = await response.json();

				if (!data.isAdmin) {
					router.push("/");
				}
			} catch (error) {
				console.error("Auth check failed:", error);
				router.push("/");
			}
		};

		checkAuth();
	}, [router]);

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="flex">
				<Sidebar />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
