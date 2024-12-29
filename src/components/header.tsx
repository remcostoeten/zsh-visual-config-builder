"use client";

const HEADER_ANIMATION_CLASSES = "transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]";
const HEADER_WIDTH_ANIMATION = "!transition-[width,max-width] !duration-800 !ease-[cubic-bezier(0.08,0.03,0.92,1.8)]";
const HEADER_DEFAULT_POSITION = "fixed top-6 z-50 left-1/2 -translate-x-1/2";
const HEADER_BACKGROUND = "border-b border-[hsla(0,0%,100%,0.06)] backdrop-blur supports-[backdrop-filter]:bg-black/20";
const HEADER_BORDER_RADIUS = "rounded-xl";
const HEADER_SCROLLED_STATE = "top-0 rounded-none bg-ray";
const SCREAM_CAP_WIDTH = "w-full max-w-full";
const SCREAM_CAP_ANIMATION = "transition-[width,max-width] duration-800 ease-[cubic-bezier(0.08,0.03,0.92,1.8)]";
const SCREAM_CAP_COLOR = "bg-[#07080a]";

import {
	Avatar,
	AvatarFallback,
	AvatarImage, DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/shared/components/ui";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, logout } from "@/features/auth/api/mutations";
import type { User } from "@/server/db/schema";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientButton from "@/shared/components/custom/gradient-button";

type NavProps = {
	user: User | null;
};

export default function Header({ user }: NavProps) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 100);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		await logout();
		router.refresh();
	};

	return (
		<main className="bg-neutral-950 relative min-h-screen overflow-hidden">
			<div className="absolute inset-0 flex justify-center">
				<div className="relative w-[90%] max-w-[1024px]">
					<div 
						className="absolute inset-0" 
						style={{
							background: 'linear-gradient(to right, #07080a 0%, transparent 10%, transparent 90%, #07080a 100%)',
						} as React.CSSProperties}
					/>
				</div>
			</div>
			<div 
				className={cn(
					`${HEADER_DEFAULT_POSITION} ${HEADER_BACKGROUND} ${HEADER_BORDER_RADIUS} ${HEADER_ANIMATION_CLASSES} ${HEADER_WIDTH_ANIMATION}`,
					scrolled && `${HEADER_SCROLLED_STATE} ${SCREAM_CAP_WIDTH} ${SCREAM_CAP_ANIMATION} ${SCREAM_CAP_COLOR}`
				)}
				style={{
					width: scrolled ? '100%' : '90%',
					maxWidth: scrolled ? '100%' : '1024px',
					backgroundColor: scrolled ? '#07080a' : 'rgba(0, 0, 0, 0.6)',
				}}
			>
				<div className={cn(
					"container transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex h-14 items-center",
					scrolled ? "px-8" : "px-4"
				)}>
					<div className="mr-4 flex">
						<a className="mr-6 flex items-center space-x-2" href="/">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 48 48"
								className="h-6 w-6"
							>
								<path
									fill="#FF6363"
									fillRule="evenodd"
									d="M12 30.99V36L-.01 23.99l2.516-2.499zM17.01 36H12l12.011 12.01 2.506-2.505zm28.487-9.497L48 24 24 0l-2.503 2.503L30.98 12h-5.732l-6.62-6.614-2.506 2.503 4.122 4.122h-2.869v18.625H36V27.77l4.122 4.122 2.503-2.506L36 22.747v-5.732z"
									clipRule="evenodd"
								/>
							</svg>
						</a>
					</div>

					<nav className="hidden md:flex flex-1 items-center justify-between">
						<div className="flex items-center gap-6">
							{['about', 'features'].map((item) => (
								<a
									key={item}
									href={`/${item.toLowerCase()}`}
									className="text-[14px] font-medium text-[#9C9C9D] hover:text-white transition-colors"
								>
									{item}
								</a>
							))}
						</div>

						<div className="flex items-center justify-end space-x-2">
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger className="relative inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-white/10">
										<Avatar isAdmin={user.role === "admin"}>
											{user.avatarUrl && (
												<AvatarImage src={user.avatarUrl} alt={user.name || "User"} />
											)}
											<AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
										</Avatar>
										<span className="hidden md:inline-block text-white">{user.name}</span>
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
								<GradientButton onClick={() => login()} className="flex items-center space-x-2 opacity-40 hover:opacity-100 duration-600 transition-all">
									<div className="flex items-center space-x-2">
										<Github className="mr-2 h-4 w-4" />
										<span className="text-xs text-neutral-200">		Login with GitHub
</span>									</div>
								</GradientButton>
							)}
						</div>
					</nav>

					<div className="md:hidden">
						<div className="flex flex-col gap-1 p-2">
							<div className="h-0.5 w-6 bg-white" />
							<div className="h-0.5 w-6 bg-white" />
							<div className="h-0.5 w-6 bg-white" />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
