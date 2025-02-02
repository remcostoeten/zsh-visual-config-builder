"use client"

import { GitBranch, Home, Github } from "lucide-react"
import { ExpandableTabs } from "./ui/expandable-tabs"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthButton } from "./auth-button"

interface HeaderProps {
    saveConfig?: () => void;
}

export function Header({ saveConfig }: HeaderProps) {
    const navigate = useNavigate()
    const location = useLocation()

    const tabs = [
        {
            title: "Config builder",
            icon: Home,
            action: () => navigate('/'),
            isActive: location.pathname === '/'
        },
        {
            title: "Roadmap",
            icon: GitBranch,
            action: () => navigate('/roadmap'),
            isActive: location.pathname === '/roadmap'
        },
        { type: "separator" as const },
        {
            title: "Github",
            icon: Github,
            action: () => window.open("https://github.com/remcostoeten/zsh-visual-config-builder", "_blank"),
        }
    ]

    return (
        <header className="sticky top-0 w-full border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 py-3 z-50">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Shell Config
                    </h1>
                    <ExpandableTabs tabs={tabs} />
                </div>
                <AuthButton />
            </div>
        </header>
    )
}
