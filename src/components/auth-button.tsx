import { motion, AnimatePresence } from "framer-motion"
import { Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthStore } from "../features/auth/github-auth"
import { UserMenu } from "./user-menu"

export function AuthButton() {
    const { isAuthenticated, login } = useAuthStore()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (isAuthenticated) {
        return <UserMenu />
    }

    return (
        <AnimatePresence mode="wait">
            {isScrolled ? (
                <motion.button
                    key="avatar"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={login}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center group hover:bg-zinc-800 hover:border-zinc-600 transition-all"
                >
                    <Lock className="w-4 h-4 text-zinc-400 group-hover:text-white/90 transition-colors" />
                </motion.button>
            ) : (
                <motion.button
                    key="button"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={login}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm hover:bg-zinc-800 hover:border-zinc-600 transition-colors group"
                >
                    <Lock className="w-4 h-4 text-zinc-400 group-hover:text-white/90 transition-colors" />
                    <span className="text-zinc-400 group-hover:text-white/90 transition-colors">Login</span>
                </motion.button>
            )}
        </AnimatePresence>
    )
} 