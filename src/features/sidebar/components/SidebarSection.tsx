import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '../../../shared/components/icons';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <motion.button
        className={`w-full px-3 py-1.5 flex items-center justify-between ${
          !isExpanded ? 'bg-gray-100 dark:bg-[#2A2A2A]' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </span>
        <motion.div
          initial={false}
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" weight="duotone" />
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                },
                opacity: {
                  duration: 0.2
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                },
                opacity: {
                  duration: 0.2
                }
              }
            }}
            className="overflow-hidden"
          >
            <div className="py-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}