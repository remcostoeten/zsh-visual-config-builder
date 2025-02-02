"use client"

import { GitBranch, Home, Settings, Github, Lock } from "lucide-react"
import { ExpandableTabs } from "./ui/expandable-tabs"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../features/auth/github-auth"

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, login, logout } = useAuthStore()

    const handleAuthAction = async () => {
        if (isAuthenticated) {
            await logout()
        } else {
            await login()
        }
    }

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
            action: () => window.open("https://github.com/yourusername/yourrepo", "_blank"),
        },
        {
            title: isAuthenticated ? "Logout" : "Login",
            icon: Lock,
            action: handleAuthAction,
        },
    ]

    return (
        <header className="w-full border-b border-zinc-800 bg-zinc-950 py-3">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">ZSH Config</h1>
                    <ExpandableTabs tabs={tabs} />
                </div>
            </div>
        </header>
    )
}
