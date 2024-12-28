"use client";

import React, {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";
import type { User } from "../types/user";

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	updateUserRole: (params: { userId: string; role: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const updateUserRole = async ({
		userId,
		role,
	}: {
		userId: string;
		role: string;
	}) => {
		try {
			const response = await fetch("/api/user/role", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, role }),
			});

			if (!response.ok) {
				throw new Error("Failed to update role");
			}

			const updatedUser = await response.json();
			if (user && user.id === userId) {
				setUser({
					...updatedUser,
					id: String(updatedUser.id),
					createdAt: updatedUser.createdAt
						? new Date(updatedUser.createdAt)
						: new Date(),
					updatedAt: new Date(),
				} as User);
			}
		} catch (error) {
			console.error("Failed to update user role:", error);
			throw error;
		}
	};

	return (
		<UserContext.Provider value={{ user, setUser, updateUserRole }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
