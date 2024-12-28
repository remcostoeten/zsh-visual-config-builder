"use server";

import { env } from "@/server/env";
import { deleteSession } from "@/services/session-service";

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;

export async function loginWithGitHub() {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    scope: "read:user user:email",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function logout() {
  await deleteSession();
}
