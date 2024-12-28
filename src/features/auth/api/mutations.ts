import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginWithGitHub, logout } from '@/services/auth-service';

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: loginWithGitHub,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    loginMutation,
    logoutMutation,
  };
}