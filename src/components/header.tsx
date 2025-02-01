import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuthStore } from '../features/auth/github-auth'
import { Github } from 'lucide-react'

interface HeaderProps {
    onSave: () => void
}

export function Header({ onSave }: HeaderProps) {
    const { isAuthenticated, username, login, logout } = useAuthStore()

    return (
        <div className='w-full border-b border-white/10'>
            <div className='max-w-[1200px] mx-auto px-8 py-4'>
                <div className='flex items-center justify-between'>
                    {/* Left side - Title */}
                    <div className='flex items-center space-x-8'>
                        <Link to='/'>
                            <h1 className='text-2xl font-bold bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent'>
                                ShellConfig Editor
                            </h1>
                        </Link>
                        <nav className='flex items-center space-x-6'>
                            <Link
                                to='/roadmap'
                                className='text-sm text-white/70 hover:text-white transition-colors'
                            >
                                Roadmap
                            </Link>
                            <button
                                className='text-sm text-white/70 hover:text-white transition-colors'
                                onClick={() =>
                                    window.open(
                                        'https://github.com/yourusername/shellconfig-editor',
                                        '_blank'
                                    )
                                }
                            >
                                About
                            </button>
                        </nav>
                    </div>

                    {/* Right side - Actions */}
                    <div className='flex items-center space-x-4'>
                        {isAuthenticated ? (
                            <>
                                <div className='flex items-center space-x-4'>
                                    <span className='text-sm text-white/70'>{username}</span>
                                    <Button
                                        onClick={onSave}
                                        className='bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white'
                                    >
                                        Save Configuration
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        onClick={logout}
                                        className='text-white/70 hover:text-white'
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button
                                onClick={login}
                                className='inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white'
                            >
                                <Github className='w-4 h-4' />
                                <span>Sign in with GitHub</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
