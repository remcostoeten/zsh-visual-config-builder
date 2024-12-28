'use client'

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'ui';
import { loginWithGitHub, logout } from '@/services/auth-service';

type AuthButtonProps = {
  isLoggedIn: boolean;
};

export function AuthButton({ isLoggedIn }: AuthButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAuth = async () => {
    startTransition(async () => {
      if (isLoggedIn) {
        await logout();
      } else {
        const loginUrl = await loginWithGitHub();
        router.push(loginUrl);
      }
      router.refresh();
    });
  };

  return (
    <Button onClick={handleAuth} disabled={isPending}>
      {isLoggedIn ? 'Logout' : 'Login with GitHub'}
    </Button>
  );
}


