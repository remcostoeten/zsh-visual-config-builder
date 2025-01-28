import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../shared/context/theme-context"
import { Check, PaintBrush } from "@phosphor-icons/react"
import type { Theme } from "../shared/config/themes"

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const previewColors = (theme: Theme) => [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.background.default,
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-[var(--background-paper)] rounded-lg shadow-lg flex items-center gap-2"
      >
        <PaintBrush className="w-5 h-5 text-[var(--text-secondary)]" weight="duotone" />
        <span className="text-sm text-[var(--text-primary)]">Theme</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-0 w-80 bg-[var(--background-paper)] rounded-lg shadow-xl p-4 space-y-4 z-50"
          >
            <div className="grid gap-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTheme(theme.name)
                    setIsOpen(false)
                  }}
                  className={`
                    p-3 rounded-lg flex items-start gap-3 w-full text-left
                    ${
                      currentTheme.name === theme.name
                        ? "bg-[var(--primary)] bg-opacity-10"
                        : "hover:bg-[var(--background-subtle)]"
                    }
                  `}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden grid grid-cols-2 grid-rows-2 gap-0.5 bg-[var(--background-subtle)]">
                    {previewColors(theme).map((color, i) => (
                      <div key={i} style={{ backgroundColor: color }} className="w-full h-full" />
                    ))}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--text-primary)]">{theme.label}</span>
                      {currentTheme.name === theme.name && (
                        <Check className="w-4 h-4 text-[var(--primary)]" weight="bold" />
                      )}
                    </div>
                    {theme.author && <span className="text-xs text-[var(--text-muted)]">by {theme.author}</span>}
                    {theme.description && (
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{theme.description}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

