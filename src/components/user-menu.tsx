import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, FileJson, Settings, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "../features/auth/github-auth"

export function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const { logout } = useAuthStore()
    
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm hover:bg-zinc-800 hover:border-zinc-600 transition-colors group"
            >
                <User className="w-4 h-4 text-zinc-400 group-hover:text-white/90 transition-colors" />
                <span className="text-zinc-400 group-hover:text-white/90 transition-colors">Account</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-64 rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg z-[9999]"
                        >
                            <div className="p-2">
                                <div className="px-2 py-3 border-b border-zinc-800">
                                    <p className="text-sm font-medium text-white/90">Signed in as</p>
                                    <p className="text-sm text-zinc-400">@remcostoeten</p>
                                </div>
                                
                                <div className="py-2">
                                    <button
                                        onClick={() => {/* TODO: Implement gist view */}}
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-zinc-400 hover:text-white/90 hover:bg-white/[0.06] rounded transition-colors"
                                    >
                                        <FileJson className="w-4 h-4" />
                                        My Saved Configs
                                    </button>
                                    
                                    <button
                                        onClick={() => {/* TODO: Implement settings */}}
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-zinc-400 hover:text-white/90 hover:bg-white/[0.06] rounded transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </button>
                                </div>

                                <div className="pt-2 border-t border-zinc-800">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.06] rounded transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
