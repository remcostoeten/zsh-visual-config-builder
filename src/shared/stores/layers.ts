import { create } from 'zustand';
import type { Layer } from '../types/canvas';

interface LayersState {
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
}

export const useLayers = create<LayersState>((set) => ({
  layers: [],
  
  addLayer: (layer) => 
    set((state) => ({ 
      layers: [...state.layers, layer] 
    })),
    
  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id)
    })),
    
  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    }))
}));