import React from 'react'
import { Maximize2, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useCanvasStore } from '@/features/canvas/canvas-slice'

interface CanvasActionsProps {
    onClearCanvas: () => void
}

export function CanvasActions({ onClearCanvas }: CanvasActionsProps) {
    const [showConfirm, setShowConfirm] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const { isZenMode, setZenMode } = useCanvasStore()

    const toggleZenMode = () => {
        setZenMode(!isZenMode)
    }

    return (
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
                    onClick={() => setShowConfirm(true)}
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

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className='fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#131316] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg border-[#333]'>
                    <DialogTitle className='text-lg font-semibold text-white'>
                        Clear Canvas?
                    </DialogTitle>
                    <div className='space-y-4'>
                        <p className='text-[13px] text-gray-400'>
                            This will remove all nodes from the canvas. This action cannot be
                            undone.
                        </p>
                        <div className='flex justify-end gap-2'>
                            <DialogClose asChild>
                                <Button variant='ghost' className='text-[13px]'>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    onClick={onClearCanvas}
                                    className='bg-red-500 hover:bg-red-600 text-[13px]'
                                >
                                    Clear Canvas
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
