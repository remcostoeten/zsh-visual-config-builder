import { ReactNode } from 'react'
import { AuthButton } from '@/components/auth-button'
import { Introduction } from '@/components/introduction'
import { useCanvasStore } from '@/features/canvas/canvas-slice'
import { ConfigNode } from '@/types/config'
import { Header } from '@/components/header'
import { TooltipProvider } from '@/shared/components/ui'

interface Props {
    children: ReactNode
}

export function MainLayout({ children }: Props) {
    // Get required actions from canvas store
    const { 
        setConfig, 
        saveConfig,
        config: currentConfig 
    } = useCanvasStore()

    // Handler functions for Introduction component
    const handleTemplateSelect = (template: ConfigNode) => {
        setConfig([template])
    }

    const handleSaveConfig = () => {
        saveConfig()
    }

    const handleLoadConfig = (config: ConfigNode) => {
        setConfig([config])
    }

    return (
        <TooltipProvider delayDuration={100}>
            <div className="min-h-screen bg-[#1A1A1A]">
                <Header />
            
                    <Introduction 
                    onTemplateSelect={handleTemplateSelect}
                    onSaveConfig={handleSaveConfig}
                    onLoadConfig={handleLoadConfig}
                    currentConfig={currentConfig}
                />
                <main>{children}</main>
            </div>
        </TooltipProvider>
    )
} 