import { create } from 'zustand'

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
const GITHUB_REDIRECT_URI =
    import.meta.env.DEV
        ? 'http://localhost:5173/auth/callback'
        : `https://${import.meta.env.VITE_VERCEL_URL}/auth/callback`

const API_URL =
    import.meta.env.DEV
        ? 'http://localhost:3001'
        : import.meta.env.VITE_API_URL

interface AuthState {
    token: string | null
    user: {
        login: string
        name: string | null
        email: string | null
        avatar_url: string
    } | null
    isAuthenticated: boolean
    login: () => void
    logout: () => void
    handleAuthCallback: (code: string) => Promise<void>
}

export const useAuthStore = create<AuthState>(set => ({
    token: localStorage.getItem('gh_token'),
    user: localStorage.getItem('gh_user') ? JSON.parse(localStorage.getItem('gh_user')!) : null,
    isAuthenticated: !!localStorage.getItem('gh_token'),

    login: () => {
        const params = new URLSearchParams({
            client_id: GITHUB_CLIENT_ID,
            redirect_uri: GITHUB_REDIRECT_URI,
            scope: 'gist'
        })
        window.location.href = `https://github.com/login/oauth/authorize?${params}`
    },

    logout: () => {
        localStorage.removeItem('gh_token')
        localStorage.removeItem('gh_user')
        set({ token: null, user: null, isAuthenticated: false })
    },

    handleAuthCallback: async (code: string) => {
        try {
            // Exchange code for token using your backend
            const response = await fetch(`${API_URL}/api/auth/github`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })

            const { access_token, username } = await response.json()

            localStorage.setItem('gh_token', access_token)
            localStorage.setItem('gh_user', JSON.stringify({ login: username }))

            set({
                token: access_token,
                user: {
                    login: username,
                    name: null,
                    email: null,
                    avatar_url: ''
                },
                isAuthenticated: true
            })
        } catch (error) {
            console.error('Auth error:', error)
        }
    }
}))
