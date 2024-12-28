"use client";

import { useUser } from "@/features/auth/context/user-context";
import { LoginButton } from "./login-button";
import { UserProfile } from "./user-profile";

export function AuthWrapper() {
	const { user } = useUser();

	return user ? <UserProfile /> : <LoginButton />;
}
