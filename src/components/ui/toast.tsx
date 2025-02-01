'use client'

import * as React from 'react'
import { Check, X, RotateCcw, Save } from 'lucide-react'
import { IOSpinner } from './spinner'
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface ToastProps {
  state: 'idle' | 'loading' | 'success' | 'error'
  onReset: () => void
  onSave: () => void
  onDismiss?: () => void
}

const toastVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 1
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="text-white">
    <title>circle-info</title>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor">
      <circle cx="9" cy="9" r="7.25"></circle>
      <line x1="9" y1="12.819" x2="9" y2="8.25"></line>
      <path d="M9,6.75c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z" fill="currentColor" data-stroke="none" stroke="none"></path>
    </g>
  </svg>
)

const springConfig = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1
}

export default function Toast({ state, onReset, onSave, onDismiss }: ToastProps) {
  const commonClasses = "h-10 bg-[#131316] rounded-[99px] shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.30)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.30)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_-8px_16px_-1px_rgba(0,0,0,0.16)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] justify-center items-center inline-flex overflow-hidden"

  return (
    <div className="bg-[#252525] border border-[#333] rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
      <span className="text-sm text-white/70">You have unsaved changes</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="text-xs px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 flex items-center gap-1"
        >
          <Save size={12} />
          Save
        </button>
        <button
          onClick={onReset}
          className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Reset
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white/60"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}