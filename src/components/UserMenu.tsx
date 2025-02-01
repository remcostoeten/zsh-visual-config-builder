import { User, LogOut, Book } from 'lucide-react';
import { useAuthStore } from '../features/auth/github-auth';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { githubGistService } from '../features/persistence/github-gist';

interface Gist {
  id: string;
  description: string;
  updated_at: string;
}

export function UserMenu() {
  const { isAuthenticated, username, token, logout } = useAuthStore();
  const [gists, setGists] = useState<Gist[]>([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      githubGistService.listGists(token).then(setGists);
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 gap-2 px-2 text-white/70 hover:text-white"
        >
          <User className="w-4 h-4" />
          <span className="text-sm">{username}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50">
            <Book className="w-4 h-4" />
            <span>Your Saved Configs</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {gists.map(gist => (
              <button
                key={gist.id}
                className="w-full px-2 py-1.5 text-left hover:bg-white/[0.06] rounded text-sm group"
              >
                <div className="text-white/90 font-medium truncate">
                  {gist.description || 'Untitled Config'}
                </div>
                <div className="text-white/40 text-xs">
                  Updated {new Date(gist.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-white/10 mt-2 pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 