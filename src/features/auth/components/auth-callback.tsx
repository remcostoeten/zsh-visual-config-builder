import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../github-auth'

export function AuthCallback() {
    const { handleAuthCallback } = useAuthStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const code = searchParams.get('code')
        if (code) {
            handleAuthCallback(code).then(() => {
                navigate('/')
            })
        }
    }, [handleAuthCallback, navigate, searchParams])

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-medium mb-2">Authenticating...</h2>
                <p className="text-white/50">Please wait while we complete the sign in process.</p>
            </div>
        </div>
    )
} 