"use client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, logout } from "@/features/auth/api/mutations";
import type { User } from "@/server/db/schema";
import { Github } from "lucide-react";

export function Header({ user }: { user: User | null }) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		setIsLoggingOut(true);
		await logout();
		router.refresh();
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 flex">
					<a className="mr-6 flex items-center space-x-2" href="/">
						<span className="font-bold sm:inline-block">ZSH Config Builder</span>
					</a>
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="flex items-center">
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger className="relative inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent">
									<Avatar isAdmin={user.role === "admin"}>
										{user.avatarUrl && (
											<AvatarImage src={user.avatarUrl} alt={user.name || "User"} />
										)}
										<AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
									</Avatar>
									<span className="hidden md:inline-block">{user.name}</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-[200px]">
									{user.role === "admin" && (
										<DropdownMenuItem className="text-xs text-muted-foreground" disabled>
											Admin Account
										</DropdownMenuItem>
									)}
									<DropdownMenuItem onSelect={handleLogout} disabled={isLoggingOut}>
										{isLoggingOut ? "Logging out..." : "Logout"}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button variant="outline" size="sm" onClick={() => login()}>
								<Github className="mr-2 h-4 w-4" />
								Login with GitHub
							</Button>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
