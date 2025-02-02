import { Trash2, Settings2, Download, RotateCcw, Wand2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useCanvasStore } from '../canvas-slice'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { ShellWizard } from './shell-wizard'
import { Tooltip } from '@/shared/components/ui/tooltip'
import { CanvasSettingsMenu } from './canvas-settings-menu'

export function CanvasToolbar() {
    const [showWizard, setShowWizard] = useState(false)
    const clearCanvas = useCanvasStore(state => state.clearCanvas)
    const resetPositions = useCanvasStore(state => state.resetPositions)

    return (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
            <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-1.5 flex items-center gap-1.5 shadow-xl">
                <CanvasSettingsMenu />

                <Tooltip content="Start New Configuration">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowWizard(true)}
                        className="h-8 w-8 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
                    >
                        <Wand2 className="w-4 h-4" />
                    </Button>
                </Tooltip>

                <Tooltip content="Reset Node Positions">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetPositions}
                        className="h-8 w-8 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </Tooltip>

                <Tooltip content="Clear Canvas">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearCanvas}
                        className="h-8 w-8 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </Tooltip>
            </div>

            <Dialog open={showWizard} onOpenChange={setShowWizard}>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                    <ShellWizard isOpen={showWizard} onClose={() => setShowWizard(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
} 