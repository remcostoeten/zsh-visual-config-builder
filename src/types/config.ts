export interface ConfigNode {
  id: string;
  title: string;
  content: string;
  type: 'main' | 'injector' | 'partial';
  level: number;
  children?: ConfigNode[];
  width?: number;
  height?: number;
  color?: string;
}

export interface Position {
  x: number;
  y: number;
}

export type NodeType = 'injector' | 'partial' | 'main';

export interface CanvasState {
  config: ConfigNode;
  positions: Record<string, Position>;
  quickAddPosition: Position | null;
  linkingNode: ConfigNode | null;
  isZenMode: boolean;
  orientation: 'normal' | 'horizontal' | 'vertical';
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNode: (id: string, updates: Partial<ConfigNode>) => void;
  setQuickAddPosition: (position: Position | null) => void;
  addNode: (type: NodeType, template: ConfigNode) => void;
  cancelLinking: () => void;
  cycleOrientation: () => void;
  setIsZenMode: (isZenMode: boolean) => void;
}