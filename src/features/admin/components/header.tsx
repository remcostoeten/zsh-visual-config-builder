"use client";

import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="border-b border-border bg-card">
			<div className="flex h-16 items-center px-4 gap-4">
				<div className="flex-1">
					<h1 className="text-xl font-semibold">Admin Dashboard</h1>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon">
						<Bell className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="icon">
						<Settings className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="icon">
						<User className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
