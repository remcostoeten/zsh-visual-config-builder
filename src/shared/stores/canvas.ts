import { create } from 'zustand';
import { storage } from '../services/storage';
import type { Point, DraggableItem, CanvasSettings } from '../types/canvas';

type CanvasStore = {
  items: DraggableItem[];
  scale: number;
  position: Point;
  isDragging: boolean;
  gridPattern: 'dots' | 'grid' | 'none';
  showEmptyState: boolean;
  settings: CanvasSettings;
  addItem: (item: DraggableItem) => void;
  removeItem: (id: string) => void;
  updateScale: (newScale: number) => void;
  updatePosition: (newPosition: Point) => void;
  setDragging: (isDragging: boolean) => void;
  toggleGridPattern: () => void;
  hideEmptyState: () => void;
  updateSettings: (settings: Partial<CanvasSettings>) => void;
  rotateArtboard: (direction: 'left' | 'right') => void;
  resetRotation: () => void;
  toggleArtboardLock: () => void;
};

const DEFAULT_SETTINGS: CanvasSettings = {
  artboard: {
    locked: false,
    rotation: 0,
  },
  pattern: {
    type: 'dots',
    color: '#4B5563',
    tileSize: 20,
    dotSize: 1,
  },
  connectors: {
    type: 'bezier',
    color: '#4B5563',
    thickness: 2,
    animate: true,
  },
};

export const useCanvas = create<CanvasStore>((set) => ({
  items: storage.getCanvasItems(),
  scale: 1,
  position: { x: 0, y: 0 },
  isDragging: false,
  gridPattern: 'dots' as const,
  showEmptyState: true,
  settings: DEFAULT_SETTINGS,
  
  addItem: (item: DraggableItem) =>
    set(state => {
      const newItems = [...state.items, item];
      storage.setCanvasItems(newItems);
      return { items: newItems, showEmptyState: false };
    }),
    
  removeItem: (id: string) =>
    set(state => {
      const newItems = state.items.filter(item => item.id !== id);
      storage.setCanvasItems(newItems);
      return { items: newItems, showEmptyState: newItems.length === 0 };
    }),
    
  updateScale: (newScale: number) => set({ scale: newScale }),
  
  updatePosition: (newPosition: Point) => 
    set(state => {
      if (state.settings.artboard.locked) return state;
      return { position: newPosition };
    }),
  
  setDragging: (isDragging: boolean) => 
    set(state => {
      if (state.settings.artboard.locked) return state;
      return { isDragging };
    }),
  
  toggleGridPattern: () =>
    set(state => {
      const patterns: ('dots' | 'grid' | 'none')[] = ['dots', 'grid', 'none'];
      const currentIndex = patterns.indexOf(state.gridPattern);
      return { gridPattern: patterns[(currentIndex + 1) % patterns.length] };
    }),

  hideEmptyState: () => set({ showEmptyState: false }),

  updateSettings: (newSettings: Partial<CanvasSettings>) =>
    set(state => ({
      settings: {
        artboard: {
          ...state.settings.artboard,
          ...(newSettings.artboard || {}),
        },
        pattern: {
          ...state.settings.pattern,
          ...(newSettings.pattern || {}),
        },
        connectors: {
          ...state.settings.connectors,
          ...(newSettings.connectors || {}),
        },
      },
    })),

  rotateArtboard: (direction: 'left' | 'right') =>
    set(state => ({
      settings: {
        ...state.settings,
        artboard: {
          ...state.settings.artboard,
          rotation: state.settings.artboard.rotation + (direction === 'left' ? -45 : 45),
        },
      },
    })),

  resetRotation: () =>
    set(state => ({
      settings: {
        ...state.settings,
        artboard: {
          ...state.settings.artboard,
          rotation: 0,
        },
      },
    })),

  toggleArtboardLock: () =>
    set(state => ({
      settings: {
        ...state.settings,
        artboard: {
          ...state.settings.artboard,
          locked: !state.settings.artboard.locked,
        },
      },
    })),
}));