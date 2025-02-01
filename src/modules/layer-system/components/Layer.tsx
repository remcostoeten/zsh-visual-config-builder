/**
 * Individual layer component with drag, resize, and selection functionality
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLayerStore } from '../stores/layer-store';
import type { Layer as LayerType } from '../types';

interface LayerProps {
  layer: LayerType;
}

export function Layer({ layer }: LayerProps) {
  const { 
    updateLayer, 
    selectLayer, 
    setHoveredLayer,
    selectedLayerId,
    hoveredLayerId 
  } = useLayerStore();
  
  const isSelected = selectedLayerId === layer.id;
  const isHovered = hoveredLayerId === layer.id;

  if (!layer.visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: layer.style?.opacity ?? 1, 
        scale: 1,
        x: layer.position.x,
        y: layer.position.y,
        rotate: layer.style?.rotation ?? 0,
      }}
      className={`
        absolute p-4 bg-paper rounded-lg shadow-lg
        ${isSelected ? 'ring-2 ring-primary' : ''}
        ${isHovered ? 'ring-1 ring-secondary' : ''}
      `}
      style={{
        width: layer.size.width,
        height: layer.size.height,
        backgroundColor: layer.style?.color,
      }}
      onClick={() => selectLayer(layer.id)}
      onMouseEnter={() => setHoveredLayer(layer.id)}
      onMouseLeave={() => setHoveredLayer(null)}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateLayer(layer.id, {
          position: {
            x: layer.position.x + info.offset.x,
            y: layer.position.y + info.offset.y,
          }
        });
      }}
    >
      {typeof layer.component === 'function' 
        ? <layer.component />
        : layer.component || (
          <>
            <div className="text-sm font-medium text-primary">
              {layer.name}
            </div>
            {layer.type && (
              <div className="text-xs text-muted">
                {layer.type}
              </div>
            )}
          </>
        )}
    </motion.div>
  );
} 