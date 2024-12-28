import { env } from "@/server/env";
import type { GithubUser, GithubTokenResponse } from "../types";

export async function getGithubUser(accessToken: string): Promise<GithubUser> {
	const response = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch GitHub user");
	}

	return response.json();
}

export async function getGithubAccessToken(code: string): Promise<string> {
	const response = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			client_id: env.GITHUB_CLIENT_ID,
			client_secret: env.GITHUB_CLIENT_SECRET,
			code,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to get access token");
	}

	const data: GithubTokenResponse = await response.json();
	return data.access_token;
}
