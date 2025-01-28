import { create } from 'zustand';
import type { Layer, LayerStore } from '../types/layer';
import { storage } from '../services/storage';

export const useLayers = create<LayerStore>((set) => ({
  layers: storage.getCanvasState(),
  hoveredLayer: null,

  addLayer: (layer) =>
    set((state) => {
      const newLayers = [...state.layers, {
        ...layer,
        size: { width: 48, height: 48 },
        style: {
          color: '#000000',
          opacity: 1,
          rotation: 0,
          ...layer.style
        }
      }];
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  clearLayers: () =>
    set(() => {
      storage.clearCanvasState();
      return { layers: [] };
    }),

  removeLayer: (id) =>
    set((state) => {
      const newLayers = state.layers.filter((layer) => layer.id !== id);
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  toggleVisibility: (id) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      );
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  updateLayerName: (id, name) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === id ? { ...layer, name } : layer
      );
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  updateLayerStyle: (id, style) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === id ? {
          ...layer,
          style: { ...layer.style, ...style }
        } : layer
      );
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  updateLayerPosition: (id, position) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === id ? { ...layer, position } : layer
      );
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  updateLayerSize: (id, size) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === id ? { ...layer, size } : layer
      );
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  updateLayerId: (oldId: string, newId: string) =>
    set((state) => {
      const newLayers = state.layers.map((layer) => {
        if (layer.id === oldId) {
          return { ...layer, id: newId };
        }
        if (layer.parent === oldId) {
          return { ...layer, parent: newId };
        }
        return layer;
      });
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  reorderLayers: (layers) =>
    set(() => {
      storage.saveCanvasState(layers);
      return { layers };
    }),

  selectLayer: (id) =>
    set((state) => {
      const newLayers = state.layers.map((layer) => ({
        ...layer,
        selected: layer.id === id,
      }));
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),

  setHoveredLayer: (id) =>
    set({ hoveredLayer: id }),

  setLayerParent: (childId, parentId) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === childId ? { ...layer, parent: parentId } : layer
      );
      storage.saveCanvasState(newLayers);
      return { layers: newLayers };
    }),
}));