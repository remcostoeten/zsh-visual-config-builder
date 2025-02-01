import { User } from 'lucide-react';
import { useAuthStore } from '../features/auth/github-auth';

function PathConfig() {
  const { isAuthenticated, username } = useAuthStore();

  return (
    <div className="fixed top-4 left-4 z-10">
      <div className="flex items-center gap-2 bg-[#252525] rounded-lg px-3 py-2 border border-[#333]">
        <User className="w-4 h-4 text-gray-400" />
        {isAuthenticated ? (
          <span className="text-sm text-white/80">{username}</span>
        ) : (
          <span className="text-sm text-white/50">Not signed in</span>
        )}
      </div>
    </div>
  );
}

export default PathConfig;