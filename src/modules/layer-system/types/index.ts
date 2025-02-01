/**
 * Core types for the layer system
 */

import type { ReactNode, ComponentType } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  selected: boolean;
  position: Point;
  size: Size;
  // Core metadata
  metadata?: Record<string, any>;
  code?: string;
  language?: string;
  // UI
  component?: ComponentType<any> | ReactNode;
  style?: {
    color: string;
    opacity: number;
    rotation: number;
  };
  // Relationships
  parent?: string;
  connectors?: Array<{
    id: string;
    startPoint: Point;
    endPoint: Point;
  }>;
  // Validation
  validated?: boolean;
  validationErrors?: string[];
}

export interface LayerStore {
  // State
  layers: Layer[];
  selectedLayerId: string | null;
  hoveredLayerId: string | null;
  
  // Core operations
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  
  // Selection
  selectLayer: (id: string | null) => void;
  setHoveredLayer: (id: string | null) => void;
  
  // Position & Size
  moveLayer: (id: string, position: Point) => void;
  resizeLayer: (id: string, size: Size) => void;
  
  // Visibility & Order
  toggleVisibility: (id: string) => void;
  reorderLayers: (layers: Layer[]) => void;
  
  // Relationships
  setLayerParent: (childId: string, parentId: string | undefined) => void;
  
  // Batch operations
  clearLayers: () => void;
} 