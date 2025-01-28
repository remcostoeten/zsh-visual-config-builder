/**
 * @author Remco Stoeten
 * @description A component that displays the current zoom level of the canvas
 */

import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass } from '@phosphor-icons/react';

type ZoomIndicatorProps = {
    zoom: number;
    isVisible: boolean;
}

function ZoomIndicator({ zoom, isVisible }: ZoomIndicatorProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 right-6 bg-black/80 text-white px-4 py-2 rounded-full 
                             text-sm font-medium backdrop-blur-sm z-50 flex items-center gap-2"
                >
                    <MagnifyingGlass className="w-4 h-4" weight="duotone" />
                    {Math.round(zoom * 100)}%
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ZoomIndicator; 