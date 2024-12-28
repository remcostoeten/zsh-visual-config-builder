"use client";

import * as React from "react";
import { useUser } from "@/features/auth/context/user-context";
import { LoginButton } from "./login-button";
import { UserProfile } from "./user-profile";
import { getUser } from "@/services/auth-service";

export function AuthWrapper() {
	const { user, setUser } = useUser();

	React.useEffect(() => {
		let mounted = true;

		const initUser = async () => {
			try {
				const userData = await getUser();
				if (mounted) {
					setUser(userData);
				}
			} catch (error) {
				console.error('Failed to initialize user:', error);
				if (mounted) {
					setUser(null);
				}
			}
		};

		initUser();

		return () => {
			mounted = false;
		};
	}, [setUser]);

	return user ? <UserProfile /> : <LoginButton />;
}
