"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, logout } from "@/features/auth/api/mutations";
import type { User } from "@/server/db/schema";

export function Header({ user }: { user: User | null }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <div className="text-2xl font-bold">My App</div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name || "User"} />
              )}
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => login()}>Login with GitHub</Button>
      )}
    </header>
  );
}
