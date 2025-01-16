import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { useLayers } from '../../../shared/stores/layers';

interface LayerEditorProps {
  layerId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function LayerEditor({ layerId, position, onClose }: LayerEditorProps) {
  const { layers, updateLayerStyle } = useLayers();
  const layer = layers.find(l => l.id === layerId);
  
  if (!layer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl p-3 space-y-3 z-50 min-w-[200px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Edit {layer.name}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
        >
          <X className="w-4 h-4 text-gray-500" weight="bold" />
        </button>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
          Color
        </label>
        <input
          type="color"
          value={layer.style?.color || '#000000'}
          onChange={(e) => updateLayerStyle(layerId, { color: e.target.value })}
          className="w-full h-8 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
          Opacity
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="100"
            value={(layer.style?.opacity || 1) * 100}
            onChange={(e) => updateLayerStyle(layerId, { opacity: parseInt(e.target.value) / 100 })}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
            {Math.round((layer.style?.opacity || 1) * 100)}%
          </span>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
          Rotation
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="360"
            value={layer.style?.rotation || 0}
            onChange={(e) => updateLayerStyle(layerId, { rotation: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
            {layer.style?.rotation || 0}°
          </span>
        </div>
      </div>
    </motion.div>
  );
}