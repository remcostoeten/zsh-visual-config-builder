"use client"

import { useState, useEffect } from "react"
import { Banner } from "../shared/components/primitives"
import { motion, AnimatePresence } from "framer-motion"

export function DemoNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenNotification = localStorage.getItem("hasSeenDemoNotification")
    if (!hasSeenNotification) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenDemoNotification", "true")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Banner
            variant="default"
            size="lg"
            rounded="default"
            className="shadow-lg shadow-black/5 fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-yellow-300"
            isClosable
            onClose={handleClose}
          >
            <div className="w-full">
              <p className="text-sm font-medium text-yellow-800">
                Demo environment: application is still being worked on and features might not work
              </p>
            </div>
          </Banner>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


