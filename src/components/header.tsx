import { GitBranch, Home, Github } from "lucide-react"
import { ExpandableTabs } from "./ui/expandable-tabs"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthButton } from "./auth-button"
import { useCanvasStore } from "@/features/canvas/canvas-slice"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Alert } from "@/shared/components/ui/alert/alert"

interface HeaderProps {
    className?: string
}

export function Header({ className }: HeaderProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const { saveConfig, hasUnsavedChanges } = useCanvasStore()
    const { showToast } = useToast()
    const [showNavigationAlert, setShowNavigationAlert] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

    const handleSave = () => {
        try {
            saveConfig()
            showToast({ type: 'success', message: 'Configuration saved successfully' })
        } catch (error) {
            showToast({ type: 'error', message: 'Failed to save configuration' })
        }
    }

    const handleNavigation = (path: string) => {
        if (hasUnsavedChanges) {
            setPendingNavigation(path)
            setShowNavigationAlert(true)
        } else {
            navigate(path)
        }
    }

    const handleConfirmNavigation = () => {
        if (pendingNavigation) {
            navigate(pendingNavigation)
            setShowNavigationAlert(false)
            setPendingNavigation(null)
        }
    }

    const tabs = [
        {
            title: "Config builder",
            icon: Home,
            action: () => handleNavigation('/'),
            isActive: location.pathname === '/'
        },
        {
            title: "Roadmap",
            icon: GitBranch,
            action: () => handleNavigation('/roadmap'),
            isActive: location.pathname === '/roadmap'
        },
        { type: "separator" as const },
        {
            title: "Save",
            icon: Github,
            action: handleSave,
            isDisabled: !hasUnsavedChanges
        },
        {
            title: "Github",
            icon: Github,
            action: () => window.open("https://github.com/remcostoeten/zsh-visual-config-builder", "_blank"),
        }
    ]

    return (
        <>
            <header className="sticky top-0 w-full border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 py-3 z-50">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl flex flex-col gap-1 font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Shell Architect
                        </h1>
                        <ExpandableTabs 
                            tabs={tabs} 
                            className={className}
                        />
                    </div>
                    <AuthButton />
                </div>
            </header>
            
            <Alert
                isOpen={showNavigationAlert}
                onClose={() => setShowNavigationAlert(false)}
                onConfirm={handleConfirmNavigation}
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave?"
                confirmText="Leave"
                cancelText="Stay"
            />
        </>
    )
}
