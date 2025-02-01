import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassPlus, MagnifyingGlassMinus } from '@phosphor-icons/react';
import { FlowNode } from './flow-node';
import { useCanvas } from '../../../shared/stores/canvas';
import { useLayers } from '../../../shared/stores/layers';
import { ConnectorGroup } from '../../../shared/components/connectors';

export function Canvas() {
  const { layers = [] } = useLayers();
  const { settings } = useCanvas();
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={canvasRef}
      className="relative flex-1 bg-subtle overflow-hidden"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Empty State */}
      {layers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No layers added yet</p>
            <p className="text-sm">Drag components from the sidebar to get started</p>
          </div>
        </div>
      )}

      {/* Layer Content */}
      <div className="absolute inset-0">
        {layers.map(layer => (
          <div key={layer.id} className="absolute inset-0">
            <FlowNode layer={layer} />
          </div>
        ))}
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg"
        >
          <MagnifyingGlassPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg"
        >
          <MagnifyingGlassMinus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  );
}