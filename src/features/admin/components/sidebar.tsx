"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Shield,
	AlertTriangle,
	Users,
	Settings,
	Activity,
	Ban,
} from "lucide-react";

const navigation = [
	{
		name: "Overview",
		href: "/admin",
		icon: Activity,
	},
	{
		name: "Rate Limits",
		href: "/admin/rate-limits",
		icon: Ban,
	},
	{
		name: "Error Logs",
		href: "/admin/errors",
		icon: AlertTriangle,
	},
	{
		name: "Users",
		href: "/admin/users",
		icon: Users,
	},
	{
		name: "Security",
		href: "/admin/security",
		icon: Shield,
	},
	{
		name: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="flex flex-col w-64 border-r border-border bg-card">
			<div className="flex-1 px-4 space-y-2 py-4">
				<nav className="flex-1 space-y-1">
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"flex items-center px-3 py-2 text-sm font-medium rounded-md",
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
								)}
							>
								<item.icon
									className={cn(
										"mr-3 h-5 w-5",
										isActive ? "text-primary" : "text-muted-foreground",
									)}
								/>
								{item.name}
							</Link>
						);
					})}
				</nav>
			</div>
		</div>
	);
}
