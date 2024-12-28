'use client';

import { useAuthMutations } from '@/features/auth/api/mutations';

export function GitHubLoginButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { loginMutation, logoutMutation } = useAuthMutations();

  const handleLogin = () => {
    loginMutation.mutate();
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    // Optionally refresh the page or update auth state
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={isLoggedIn ? handleLogout : handleLogin}
      className="px-4 py-2 bg-gray-800 text-white rounded-md"
      disabled={loginMutation.isPending || logoutMutation.isPending}
    >
      {loginMutation.isPending || logoutMutation.isPending ? (
        'Loading...'
      ) : isLoggedIn ? (
        'Logout'
      ) : (
        'Login with GitHub'
      )}
    </button>
  );
} 