import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Eye, EyeOff, Trash, Pencil, Gear } from '../../../shared/components/icons';
import { useLayers } from '../../../shared/stores/layers';
import type { Layer } from '../../../shared/types/layer';

function LayerSettings({ layer, onClose }: { layer: Layer; onClose: () => void }) {
  const { updateLayerStyle } = useLayers();

  return (
    <div className="absolute right-0 top-0 w-48 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl p-3 space-y-3 z-50">
      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
          Color
        </label>
        <input
          type="color"
          value={layer.style?.color || '#000000'}
          onChange={(e) => updateLayerStyle(layer.id, { color: e.target.value })}
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
            onChange={(e) => updateLayerStyle(layer.id, { opacity: parseInt(e.target.value) / 100 })}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
            {Math.round((layer.style?.opacity || 1) * 100)}%
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded"
      >
        Close
      </button>
    </div>
  );
}

export function LayerPanel() {
  const { layers, hoveredLayer, toggleVisibility, removeLayer, updateLayerName, reorderLayers, selectLayer, setHoveredLayer } = useLayers();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [settingsId, setSettingsId] = React.useState<string | null>(null);

  return (
    <div className="w-64 border-l border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-[#2A2A2A]">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white">Layers</h2>
      </div>
      
      <Reorder.Group 
        axis="y" 
        values={layers} 
        onReorder={reorderLayers}
        className="p-2 space-y-1"
      >
        <AnimatePresence>
          {layers.map((layer) => (
            <Reorder.Item
              key={layer.id}
              value={layer}
              dragListener={false}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                group relative px-3 py-2 rounded-lg cursor-pointer select-none
                ${layer.selected ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 
                  hoveredLayer === layer.id ? 'bg-gray-50 dark:bg-gray-800/50' : 
                  'hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'}
                transition-all duration-150
              `}
              onClick={() => selectLayer(layer.id)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(layer.id);
                  }}
                  className={`p-1 rounded ${layer.selected ? 'hover:bg-blue-100 dark:hover:bg-blue-800/50' : 'hover:bg-gray-100 dark:hover:bg-[#3A3A3A]'}`}
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" weight="duotone" />
                  )}
                </motion.button>
                
                {editingId === layer.id ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={layer.name}
                    onBlur={(e) => {
                      updateLayerName(layer.id, e.target.value);
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateLayerName(layer.id, e.currentTarget.value);
                        setEditingId(null);
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                  />
                ) : (
                  <span className={`flex-1 text-sm truncate ${layer.selected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                    {layer.name}
                  </span>
                )}
                
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(layer.id);
                    }}
                    className={`p-1 rounded ${layer.selected ? 'hover:bg-blue-100 dark:hover:bg-blue-800/50' : 'hover:bg-gray-100 dark:hover:bg-[#3A3A3A]'}`}
                  >
                    <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSettingsId(layer.id === settingsId ? null : layer.id);
                    }}
                    className={`p-1 rounded ${layer.selected ? 'hover:bg-blue-100 dark:hover:bg-blue-800/50' : 'hover:bg-gray-100 dark:hover:bg-[#3A3A3A]'}`}
                  >
                    <Gear className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
                    className={`p-1 rounded ${layer.selected ? 'hover:bg-blue-100 dark:hover:bg-blue-800/50' : 'hover:bg-gray-100 dark:hover:bg-[#3A3A3A]'}`}
                  >
                    <Trash className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                  </motion.button>
                </div>
              </div>

              {settingsId === layer.id && (
                <LayerSettings 
                  layer={layer} 
                  onClose={() => setSettingsId(null)} 
                />
              )}
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      
      {layers.length === 0 && (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No layers yet
          </p>
        </div>
      )}
    </div>
  );
}