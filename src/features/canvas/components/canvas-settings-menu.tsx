import { Settings2, Lock, Unlock } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useCanvasStore } from '../canvas-slice'
import { Switch } from '@/shared/components/ui/switch'
import { Tooltip } from '@/shared/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'

export function CanvasSettingsMenu() {
    const isCanvasLocked = useCanvasStore(state => state.isCanvasLocked)
    const toggleCanvasLock = useCanvasStore(state => state.toggleCanvasLock)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
                    >
                        <Settings2 className="w-4 h-4" />
                    </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-64 bg-[#1E1E1E] border-zinc-800"
            >
                <DropdownMenuLabel className="text-zinc-400">Canvas Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                
                <div className="px-2 py-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isCanvasLocked ? (
                                <Lock className="w-4 h-4 text-orange-400" />
                            ) : (
                                <Unlock className="w-4 h-4 text-emerald-400" />
                            )}
                            <span className="text-sm text-zinc-300">Lock Canvas Movement</span>
                        </div>
                        <Switch
                            checked={isCanvasLocked}
                            onCheckedChange={toggleCanvasLock}
                            className="data-[state=checked]:bg-orange-500"
                        />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 ml-6">
                        Prevent canvas dragging and scrolling
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 