export interface Point {
  x: number;
  y: number;
}

export interface CanvasSettings {
  artboard: {
    locked: boolean;
    rotation: number;
  };
  pattern: {
    type: 'dots' | 'grid' | 'tiles' | 'none';
    color: string;
    tileSize: number;
    dotSize: number;
  };
  connectors: {
    type: 'bezier' | 'orthogonal';
    color: string;
    thickness: number;
    animate: boolean;
  };
}

export interface CanvasState {
  scale: number;
  position: Point;
  isDragging: boolean;
  settings: CanvasSettings;
}

export interface DraggableItem {
  id: string;
  type: string;
  title: string;
  description: string;
}

export interface Connector {
  start: Point;
  end: Point;
  type: 'bezier' | 'orthogonal';
  parentId: string;
  childId: string;
}