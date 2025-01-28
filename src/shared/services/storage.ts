/**
 * @author Remco Stoeten
 * @description Storage service for persisting canvas state in localStorage
 */

import type { Layer } from '../types/layer';

const STORAGE_KEY = 'canvas_state';

export const storage = {
  saveCanvasState: (layers: Layer[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layers));
    } catch (error) {
      console.error('Failed to save canvas state:', error);
    }
  },

  getCanvasState: (): Layer[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load canvas state:', error);
      return [];
    }
  },

  clearCanvasState: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear canvas state:', error);
    }
  }
};