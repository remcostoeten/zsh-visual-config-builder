import React from 'react';
import { motion } from 'framer-motion';
import type { Layer } from '../../../shared/types/canvas';

interface FlowNodeProps {
  layer: Layer;
}

export function FlowNode({ layer }: FlowNodeProps) {
  if (!layer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute p-4 bg-paper rounded-lg shadow-lg"
      style={{
        left: layer.position?.x || 0,
        top: layer.position?.y || 0,
      }}
    >
      <div className="text-sm font-medium text-primary">
        {layer.name}
      </div>
      {layer.type && (
        <div className="text-xs text-muted">
          {layer.type}
        </div>
      )}
    </motion.div>
  );
}