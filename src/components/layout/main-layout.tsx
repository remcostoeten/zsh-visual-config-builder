import { Header } from '../header'
import Footer from '../footer'
import { motion, AnimatePresence } from 'framer-motion'

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
            <Header />
            <AnimatePresence mode="wait">
                <motion.main 
                    className="flex-1 flex flex-col px-3 py-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
} 