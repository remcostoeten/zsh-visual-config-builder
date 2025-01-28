/**
 * @author Remco Stoeten
 * @description A reusable component that displays content with an animated border effect
 * The border animates in a continuous motion around the edges of the container
 */

import { motion } from 'framer-motion';

type AnimatedNodeProps = {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

function AnimatedNode({ children, className, color = '#3b82f6' }: AnimatedNodeProps) {
    // Convert hex to rgb for the gradient
    const getRgbValues = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };

    const rgb = getRgbValues(color);
    const lighterRgb = {
        r: Math.min(255, rgb.r + 40),
        g: Math.min(255, rgb.g + 40),
        b: Math.min(255, rgb.b + 40),
    };

    return (
        <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div 
                className="absolute inset-0 rounded-xl"
                animate={{
                    background: [
                        `linear-gradient(90deg, rgb(${rgb.r}, ${rgb.g}, ${rgb.b}), rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}), rgb(${rgb.r}, ${rgb.g}, ${rgb.b}))`,
                    ],
                    backgroundPosition: ["0% 50%", "200% 50%"],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <div 
                className={`
                    relative z-10 
                    bg-[#1A1A1A] dark:bg-zinc-900/90
                    rounded-xl p-6
                    ${className || ''}
                `}
            >
                {children}
            </div>
        </motion.div>
    );
}

export default AnimatedNode; 