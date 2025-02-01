'use client'

import { Save, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
    state: {
        type: 'initial' | 'loading' | 'success' | 'error'
        message?: string
    }
    onReset: () => void
    onSave: () => void
}

const springConfig = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 1
}

export function Toast({ state, onReset, onSave }: ToastProps) {
    return (
        <AnimatePresence>
            <motion.div
                className='bg-[#252525] border border-[#333] rounded-lg shadow-lg px-4 py-2 flex items-center gap-3'
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: springConfig
                }}
                exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                    transition: { duration: 0.2 }
                }}
            >
                <span className='text-sm text-white/70'>
                    {state.message || 'You have unsaved changes'}
                </span>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={onSave}
                        className='text-xs px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 flex items-center gap-1'
                    >
                        <Save size={12} />
                        Save
                    </button>
                    <button
                        onClick={onReset}
                        className='text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 flex items-center gap-1'
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default Toast
