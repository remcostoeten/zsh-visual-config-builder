import type { Point } from './canvas';

export interface Layer {
  id: string;
  name: string;
  type: 'circle' | 'square' | 'arrow' | 'scribble' | 'zshrc' | 'main' | 'aliases' | 'git-aliases' | 'dev-aliases' | 'functions';
  visible: boolean;
  selected: boolean;
  component: React.ReactNode;
  position: Point;
  metadata?: string;
  code?: string;
  language?: string;
  size?: {
    width: number;
    height: number;
  };
  parent?: string;
  style?: {
    color: string;
    opacity: number;
    rotation: number;
  };
}

export interface LayerStore {
  layers: Layer[];
  hoveredLayer: string | null;
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  toggleVisibility: (id: string) => void;
  updateLayerName: (id: string, name: string) => void;
  updateLayerStyle: (id: string, style: Partial<Layer['style']>) => void;
  updateLayerPosition: (id: string, position: Point) => void;
  updateLayerSize: (id: string, size: { width: number; height: number }) => void;
  reorderLayers: (layers: Layer[]) => void;
  selectLayer: (id: string) => void;
  setHoveredLayer: (id: string | null) => void;
  setLayerParent: (childId: string, parentId: string | undefined) => void;
}