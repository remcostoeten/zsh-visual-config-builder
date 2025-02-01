/**
 * Zustand store for managing layers
 */

import { create } from 'zustand';
import type { Layer, LayerStore } from '../types';

export const useLayerStore = create<LayerStore>((set) => ({
  layers: [],
  selectedLayerId: null,
  hoveredLayerId: null,

  addLayer: (layer) => 
    set((state) => ({ 
      layers: [...state.layers, layer] 
    })),
    
  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),
    
  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),

  selectLayer: (id) =>
    set({ selectedLayerId: id }),

  setHoveredLayer: (id) =>
    set({ hoveredLayerId: id }),

  moveLayer: (id, position) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, position } : layer
      ),
    })),

  resizeLayer: (id, size) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, size } : layer
      ),
    })),

  toggleVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    })),

  reorderLayers: (layers) =>
    set({ layers }),

  setLayerParent: (childId, parentId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === childId ? { ...layer, parent: parentId } : layer
      ),
    })),

  clearLayers: () =>
    set({ layers: [], selectedLayerId: null, hoveredLayerId: null }),
})); 