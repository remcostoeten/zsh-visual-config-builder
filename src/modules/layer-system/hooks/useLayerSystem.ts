/**
 * Custom hook for common layer operations
 */

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLayerStore } from '../stores/layer-store';
import type { Layer, Point, Size } from '../types';

interface CreateLayerOptions {
  type: string;
  name: string;
  position?: Point;
  size?: Size;
  metadata?: Record<string, any>;
}

export function useLayerSystem() {
  const { 
    layers,
    addLayer, 
    removeLayer, 
    updateLayer,
    selectLayer,
    selectedLayerId
  } = useLayerStore();

  const createLayer = useCallback(({
    type,
    name,
    position = { x: 0, y: 0 },
    size = { width: 140, height: 80 },
    metadata = {}
  }: CreateLayerOptions) => {
    const layer: Layer = {
      id: uuidv4(),
      type,
      name,
      visible: true,
      selected: false,
      position,
      size,
      metadata
    };
    
    addLayer(layer);
    return layer;
  }, [addLayer]);

  return {
    layers,
    selectedLayerId,
    createLayer,
    removeLayer,
    updateLayer,
    selectLayer
  };
} 