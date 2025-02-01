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