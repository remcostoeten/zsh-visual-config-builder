import { motion, useDragControls } from 'framer-motion'
import { ShellWizard } from './shell-wizard'

interface DraggableWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DraggableWizard({ isOpen, onClose }: DraggableWizardProps) {
    const controls = useDragControls()

    return (
        <motion.div
            drag
            dragControls={controls}
            dragMomentum={false}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
        >
            <div 
                className="cursor-move"
                onPointerDown={(e) => {
                    controls.start(e)
                }}
            >
                <ShellWizard isOpen={isOpen} onClose={onClose} />
            </div>
        </motion.div>
    )
} 