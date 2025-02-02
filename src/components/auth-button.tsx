import { useAuthStore } from '@/features/auth/github-auth'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export function AuthButton() {
    const { user, logout } = useAuthStore()

    if (!user) {
        return (
            <Button variant="ghost" className="text-gray-400 hover:text-white">
                Sign in with GitHub
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <img 
                        src={user.avatar_url} 
                        alt={user.login} 
                        className="w-6 h-6 rounded-full"
                    />
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name || user.login}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 