export interface Position {
  x: number;
  y: number;
}

export interface ConfigNode {
  id: string;
  title: string;
  content: string;
  type: 'main' | 'injector' | 'partial';
  children?: ConfigNode[];
}