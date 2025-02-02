import { Heart, Coffee, BookOpen, Github } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 z-10 w-full border-t border-zinc-800 bg-gradient-to-t from-zinc-900 to-zinc-950"
        >
            <div className="container mx-auto p-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>Built with</span>
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>by</span>
                        <a
                            href="https://github.com/remcostoeten"
                            className="text-white/80 hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @remcostoeten
                        </a>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.buymeacoffee.com/remcostoeten"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Coffee className="w-4 h-4" />
                            <span>Buy me a coffee</span>
                        </a>

                        <div className="h-4 w-px bg-zinc-800" />

                        <a
                            href="https://zsh.sourceforge.io/Doc/"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>ZSH Docs</span>
                        </a>

                        <div className="h-4 w-px bg-zinc-800" />

                        <a
                            href="https://github.com/remcostoeten/zsh-visual-config-builder"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-4 h-4" />
                            <span>Source</span>
                        </a>
                    </div>
                </div>
            </div>
        </motion.footer>
    )
}
