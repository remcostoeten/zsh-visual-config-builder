import { create } from 'zustand';
import type { Layer, LayerStore } from '../types/layer';

export const useLayers = create<LayerStore>((set) => ({
  layers: [],
  hoveredLayer: null,

  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, {
        ...layer,
        size: { width: 48, height: 48 },
        style: {
          color: '#000000',
          opacity: 1,
          rotation: 0,
          ...layer.style
        }
      }],
    })),

  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    })),

  toggleVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    })),

  updateLayerName: (id, name) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, name } : layer
      ),
    })),

  updateLayerStyle: (id, style) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? {
          ...layer,
          style: { ...layer.style, ...style }
        } : layer
      ),
    })),

  updateLayerPosition: (id, position) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, position } : layer
      ),
    })),

  updateLayerSize: (id, size) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, size } : layer
      ),
    })),

  updateLayerId: (oldId, newId) =>
    set((state) => {
      // Update the layer's ID
      const updatedLayers = state.layers.map((layer) => {
        if (layer.id === oldId) {
          return { ...layer, id: newId };
        }
        // Update any parent references
        if (layer.parent === oldId) {
          return { ...layer, parent: newId };
        }
        return layer;
      });
      return { layers: updatedLayers };
    }),

  reorderLayers: (layers) =>
    set({ layers }),

  selectLayer: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) => ({
        ...layer,
        selected: layer.id === id,
      })),
    })),

  setHoveredLayer: (id) =>
    set({ hoveredLayer: id }),

  setLayerParent: (childId, parentId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === childId ? { ...layer, parent: parentId } : layer
      ),
    })),
}));