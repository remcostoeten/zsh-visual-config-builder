"use client";

import { useUser } from "@/features/auth/context/user-context";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { logout } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export function UserProfile() {
	const { user } = useUser();
	const router = useRouter();

	if (!user) return null;

	const handleLogout = async () => {
		await logout();
		router.refresh();
	};

	return (
		<div className="flex items-center gap-4">
			{user.avatarUrl && (
				<Image
					src={user.avatarUrl}
					alt={user.name || "User avatar"}
					width={32}
					height={32}
					className="rounded-full"
				/>
			)}
			<div className="flex flex-col">
				<span className="font-medium">{user.name}</span>
				<span className="text-sm text-gray-500">{user.email}</span>
			</div>
			<Button onClick={handleLogout} variant="outline" size="sm">
				Logout
			</Button>
		</div>
	);
}
