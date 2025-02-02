"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOnClickOutside } from "usehooks-ts"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Tab {
  title: string
  icon: LucideIcon
  action?: () => void
  isActive?: boolean
  type?: never
}

interface Separator {
  type: "separator"
  title?: never
  icon?: never
  action?: never
}

type TabItem = Tab | Separator

interface ExpandableTabsProps {
  tabs: TabItem[]
  className?: string
  onChange?: (index: number | null) => void
}

const buttonVariants = {
  initial: {
    width: "auto",
  },
  animate: (isSelected: boolean) => ({
    width: isSelected ? "auto" : "auto",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: {
    width: "auto",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
}

export function ExpandableTabs({ tabs, className, onChange }: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null)
  const outsideClickRef = React.useRef(null)

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null)
    onChange?.(null)
  })

  const handleSelect = (index: number, action?: () => void) => {
    setSelected(index)
    onChange?.(index)
    if (action) {
      action()
    }
  }

  const Separator = () => <div className="mx-1 h-[24px] w-[1px] bg-zinc-800" aria-hidden="true" />

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-zinc-800 bg-black p-1 shadow-sm",
        className,
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />
        }

        const Icon = tab.icon
        const isActive = tab.isActive || selected === index
        
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            custom={isActive}
            onClick={() => handleSelect(index, tab.action)}
            className={cn(
              "relative flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-300",
              isActive 
                ? "bg-zinc-800 text-white" 
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
            )}
          >
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence initial={false}>
              {(isActive || selected === index) && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="ml-2 overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
} 