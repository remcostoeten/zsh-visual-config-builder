/**
 * Main canvas component for rendering and managing layers
 */

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Layer } from './Layer';
import { useLayerStore } from '../stores/layer-store';
import type { Point } from '../types';

interface CanvasProps {
  className?: string;
  onDrop?: (position: Point) => void;
  gridEnabled?: boolean;
  children?: React.ReactNode;
}

export function Canvas({ 
  className = '', 
  onDrop,
  gridEnabled = true,
  children 
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { layers } = useLayerStore();

  const handleDrop = (e: React.DragEvent) => {
    if (!canvasRef.current || !onDrop) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    onDrop(position);
  };

  return (
    <div 
      ref={canvasRef}
      className={`relative flex-1 bg-subtle overflow-hidden ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {gridEnabled && (
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      )}
      
      {layers.map(layer => (
        <Layer key={layer.id} layer={layer} />
      ))}

      {children}
    </div>
  );
} 