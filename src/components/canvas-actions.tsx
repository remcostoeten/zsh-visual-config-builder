import React from 'react'
import { Maximize2, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useCanvasStore } from '@/features/canvas/canvas-slice'
import { Alert } from '@/shared/components/ui/alert/alert'

interface CanvasActionsProps {
    onClearCanvas: () => void
}

export function CanvasActions({ onClearCanvas }: CanvasActionsProps) {
    const [showConfirmAlert, setShowConfirmAlert] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const { isZenMode, setZenMode } = useCanvasStore()

    const toggleZenMode = () => {
        setZenMode(!isZenMode)
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={toggleZenMode}
                    className='h-9 w-9 rounded-full hover:bg-white/[0.08] relative group'
                >
                    <Maximize2 className='h-5 w-5 text-gray-400 group-hover:scale-110 transition-transform' />
                    <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                        {isZenMode ? 'Exit Zen Mode' : 'Enter Zen Mode'}
                    </span>
                </Button>

                <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setShowConfirmAlert(true)}
                        className='h-9 w-9 rounded-full hover:bg-red-500/10 relative group'
                    >
                        <Trash2 className='h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors' />
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className='absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-white/70 whitespace-nowrap'
                                >
                                    Clear Canvas
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            <Alert
                isOpen={showConfirmAlert}
                onClose={() => setShowConfirmAlert(false)}
                onConfirm={() => {
                    onClearCanvas()
                    setShowConfirmAlert(false)
                }}
                title="Clear Canvas"
                description="Are you sure you want to clear the canvas? This action cannot be undone."
                confirmText="Clear"
                cancelText="Cancel"
            />
        </>
    )
}
