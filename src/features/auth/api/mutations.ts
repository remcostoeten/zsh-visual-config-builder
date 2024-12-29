"use server";

import { env } from "@/server/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login() {
	const params = new URLSearchParams({
		client_id: env.GITHUB_CLIENT_ID || "",
		redirect_uri: `${env.APP_URL}/api/auth/callback`,
		scope: "read:user user:email",
	});

	redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

export async function logout() {
	const cookieStore = await cookies();
	cookieStore.delete("token");
	redirect("/");
}
