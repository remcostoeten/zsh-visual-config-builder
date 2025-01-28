import type { Point } from './canvas';

export interface Layer {
  id: string;
  name: string;
  type: 
    | 'shell_config'    // .zshrc, .bashrc, .bash_profile
    | 'main_injector'   // main entry point
    | 'env_injector'    // environment variables
    | 'alias_injector'  // alias definitions
    | 'path_injector'   // PATH modifications
    | 'function_injector' // shell functions
    | 'custom_injector'; // user-defined injectors
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
  // New fields for shell configuration
  shellType?: 'zsh' | 'bash';
  sourceOrder?: number;
  validated?: boolean;
  validationErrors?: string[];
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
  updateLayerId: (oldId: string, newId: string) => void;
  clearLayers: () => void;
}