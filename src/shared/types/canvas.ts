export interface Point {
  x: number;
  y: number;
}

export interface CanvasSettings {
  pattern: {
    type: 'dots' | 'grid' | 'tiles' | 'none';
    color: string;
    size: number;
    thickness: number;
    opacity: number;
  };
  background: {
    color: string;
  };
  artboard: {
    locked: boolean;
    rotation: number;
  };
  connectors: {
    type: 'bezier' | 'straight';
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

export interface Layer {
  id: string;
  name: string;
  type: string;
  position?: Point;
  visible?: boolean;
  selected?: boolean;
  connectors?: Array<{
    id: string;
    startPoint: Point;
    endPoint: Point;
  }>;
}