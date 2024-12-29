export interface ConnectorSettings {
  // Theme Settings
  theme: 'dark' | 'darker' | 'light';
  accentColor: string;
  connectorColor: string;

  // Animation Settings
  animationSpeed: number;
  dashLength: number;
  lineWidth: number;
  animationsEnabled: boolean;

  // Node Settings
  nodeWidth: number;
  nodePadding: number;
  nodeSpacing: number;
  nodeBorderRadius: number;
  nodeBackgroundOpacity: number;

  // Layout Settings
  layout: 'horizontal' | 'vertical';
  autoLayout: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Shell Settings
  useShebang: boolean;
  shebangType: 'zsh' | 'bash';
  defaultShebang: boolean;

  // Export Settings
  indentSize: number;
  useSpaces: boolean;
  addComments: boolean;
  groupByType: boolean;
}