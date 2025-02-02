import { motion } from 'framer-motion'
import { devTemplate } from '../../../config/templates'
import { ConfigNode } from '../../../types/config'
import { useAuthStore } from '@/features/auth/github-auth'
import { Button } from "@/shared/components/ui"

interface Props {
    onTemplateSelect: (template: ConfigNode) => void
    onSaveConfig: () => void
    onLoadConfig: (config: ConfigNode) => void
    currentConfig: ConfigNode
}

export function Introduction({ onTemplateSelect, onSaveConfig, onLoadConfig, currentConfig }: Props) {
    const { isAuthenticated } = useAuthStore()

    const dockerConfig = {
        ...devTemplate,
        id: 'docker-config',
        children: devTemplate.children?.filter(child => 
            child.title.includes('docker') || child.type === 'main'
        ) || []
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-4"
        >
            <div className="space-y-4">
                <div className="flex gap-4">
                    <Button
                        onClick={() => onTemplateSelect(devTemplate)}
                        className="flex-1 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700"
                    >
                        <h3 className="text-sm font-medium text-white">Development Setup</h3>
                        <p className="text-xs text-zinc-400 mt-1">Git, Node.js, and common dev tools</p>
                    </Button>
                    <Button
                        onClick={() => onTemplateSelect(dockerConfig)}
                        className="flex-1 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700"
                    >
                        <h3 className="text-sm font-medium text-white">Docker Setup</h3>
                        <p className="text-xs text-zinc-400 mt-1">Container management and deployment</p>
                    </Button>
                </div>
                {!isAuthenticated && (
                    <p className="text-xs text-zinc-500 text-center">
                        Sign in with GitHub to save your configurations
                    </p>
                )}
            </div>
        </motion.div>
    )
} 