import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function WelcomeScreen() {
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            navigate('/builder')
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [navigate])

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4 p-4">
            <div className="max-w-2xl text-center space-y-2">
                <h1 className="text-3xl font-bold text-white mb-2">Shell Config Builder</h1>
                <div className="flex flex-col gap-4 items-center">
                    <div className="grid grid-cols-3 gap-4 text-left text-sm">
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <h3 className="font-medium text-white mb-1">Zsh</h3>
                            <code className="text-emerald-400">% echo "Hello"</code>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <h3 className="font-medium text-white mb-1">Bash</h3>
                            <code className="text-emerald-400">$ echo "Hello"</code>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <h3 className="font-medium text-white mb-1">Fish</h3>
                            <code className="text-emerald-400">> echo "Hello"</code>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-zinc-400">
                        Press any key to start building your shell configuration
                    </div>
                </div>
            </div>
        </div>
    )
} 