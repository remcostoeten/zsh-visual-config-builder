"use client";

import { Button } from "@/shared/components/ui/button";
import { loginWithGitHub } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export function LoginButton() {
	const router = useRouter();

	const handleLogin = async () => {
		const url = await loginWithGitHub();
		router.push(url);
	};

	return (
		<Button onClick={handleLogin} variant="outline" size="sm">
			Login with GitHub
		</Button>
	);
}
