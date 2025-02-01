import { create } from 'zustand';
import { ConfigNode, Position } from '@/types/config';
import { generateId } from '@/utils/generateId';

interface CanvasState {
  config: ConfigNode;
  positions: Record<string, Position>;
  quickAddPosition: Position | null;
  isZenMode: boolean;
  orientation: 'normal' | 'horizontal' | 'vertical';
  hasUnsavedChanges: boolean;
  linkingNode: { id: string; type: 'parent' | 'child' } | null;
  setConfig: (config: ConfigNode) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNode: (id: string, updates: Partial<ConfigNode>) => void;
  setQuickAddPosition: (position: Position | null) => void;
  setZenMode: (isZenMode: boolean) => void;
  cycleOrientation: () => void;
  clearCanvas: () => void;
  addNode: (type: 'injector' | 'partial', template?: ConfigNode) => void;
  removeNode: (id: string) => void;
  startLinking: (id: string, type: 'parent' | 'child') => void;
  finishLinking: (targetId: string) => void;
  cancelLinking: () => void;
  markChangesSaved: () => void;
  saveConfig: () => void;
  loadConfig: (config: ConfigNode) => void;
}

const INITIAL_OFFSET = { x: 50, y: 50 };
const NODE_SPACING = 300; // Increased from 200 to 300 for better spacing

export const useCanvasStore = create<CanvasState>((set, get) => ({
  config: {
    id: 'main',
    title: '.zshrc',
    content: '',
    level: 0,
    type: 'main',
    children: []
  },
  positions: {
    main: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
  },
  quickAddPosition: null,
  isZenMode: false,
  orientation: 'normal',
  hasUnsavedChanges: false,
  linkingNode: null,

  setConfig: (config) => {
    const positions: Record<string, Position> = {
      [config.id]: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
    };
    
    const calculatePositions = (node: ConfigNode, depth: number = 0, index: number = 0) => {
      if (node.children) {
        node.children.forEach((child, i) => {
          positions[child.id] = {
            x: INITIAL_OFFSET.x + (depth + 1) * NODE_SPACING,
            y: INITIAL_OFFSET.y + i * NODE_SPACING
          };
          calculatePositions(child, depth + 1, i);
        });
      }
    };
    
    calculatePositions(config);
    set({ config, positions, hasUnsavedChanges: true });
  },
  
  updateNodePosition: (id, x, y) => 
    set((state) => ({
      positions: {
        ...state.positions,
        [id]: { x, y }
      },
      hasUnsavedChanges: true
    })),

  updateNode: (id, updates) =>
    set((state) => {
      const updateNode = (node: ConfigNode): ConfigNode => {
        if (node.id === id) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(updateNode)
          };
        }
        return node;
      };
      return { 
        config: updateNode(state.config),
        hasUnsavedChanges: true
      };
    }),

  setQuickAddPosition: (position) => set({ quickAddPosition: position }),
  
  setZenMode: (isZenMode) => set({ isZenMode }),

  cycleOrientation: () => set((state) => ({ 
    orientation: state.orientation === 'normal' 
      ? 'horizontal' 
      : state.orientation === 'horizontal' 
        ? 'vertical' 
        : 'normal' 
  })),

  clearCanvas: () => set({
    config: {
      id: 'main',
      title: '.zshrc',
      content: '',
      type: 'main',
      children: []
    },
    positions: {
      main: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
    },
    hasUnsavedChanges: true
  }),

  addNode: (type, template?) => set((state) => {
    if (!state.quickAddPosition) return state;

    // Only allow injectors as direct children of root
    if (type === 'injector') {
      const newNode = {
        id: generateId(),
        title: template ? template.title : 'new_injector.sh',
        content: template ? template.content : '# New file content',
        type,
        level: 1,
        children: []
      };

      return {
        config: {
          ...state.config,
          children: [...(state.config.children || []), newNode]
        },
        positions: {
          ...state.positions,
          [newNode.id]: state.quickAddPosition
        },
        quickAddPosition: null,
        hasUnsavedChanges: true
      };
    }

    // Partials can only be added to injectors
    if (type === 'partial') {
      // Find closest injector parent
      const findParentInjector = (node: ConfigNode): ConfigNode | null => {
        if (node.type === 'injector') return node;
        if (!node.children) return null;
        for (const child of node.children) {
          const found = findParentInjector(child);
          if (found) return found;
        }
        return null;
      };

      const parentInjector = findParentInjector(state.config);
      if (!parentInjector) return state; // Don't add partial if no injector found

      const newNode = {
        id: generateId(),
        title: template ? template.title : 'new_partial.sh',
        content: template ? template.content : '# New file content',
        type,
        level: parentInjector.level + 1
      };

      // Add partial to the found injector
      return {
        config: {
          ...state.config,
          children: state.config.children?.map(node => 
            node.id === parentInjector.id 
              ? { ...node, children: [...(node.children || []), newNode] }
              : node
          ) || []
        },
        positions: {
          ...state.positions,
          [newNode.id]: state.quickAddPosition
        },
        quickAddPosition: null,
        hasUnsavedChanges: true
      };
    }

    return state;
  }),

  removeNode: (id) => set((state) => {
    const removeNodeFromTree = (node: ConfigNode): ConfigNode => {
      if (node.children) {
        return {
          ...node,
          children: node.children
            .filter(child => child.id !== id)
            .map(removeNodeFromTree)
        };
      }
      return node;
    };

    const newPositions = { ...state.positions };
    delete newPositions[id];

    return {
      config: removeNodeFromTree(state.config),
      positions: newPositions,
      hasUnsavedChanges: true
    };
  }),

  startLinking: (id, type) => set({ linkingNode: { id, type } }),

  finishLinking: (targetId) => set((state) => {
    if (!state.linkingNode) return state;

    const { id: sourceId, type } = state.linkingNode;
    
    const findAndUpdateNodes = (node: ConfigNode): ConfigNode => {
      const updateNodeLevel = (node: ConfigNode, level: number): ConfigNode => {
        const updatedNode = { ...node, level };
        if (node.children) {
          updatedNode.children = node.children.map(child => 
            updateNodeLevel(child, level + 1)
          );
        }
        return updatedNode;
      };

      if (type === 'parent' && node.id === targetId) {
        // Add as child to target node
        const sourceNode = findNodeById(state.config, sourceId);
        if (sourceNode) {
          const updatedSourceNode = updateNodeLevel(sourceNode, node.level + 1);
          return {
            ...node,
            children: [...(node.children || []), updatedSourceNode]
          };
        }
      } else if (type === 'child' && node.id === sourceId) {
        // Add target node as child
        const targetNode = findNodeById(state.config, targetId);
        if (targetNode) {
          const updatedTargetNode = updateNodeLevel(targetNode, node.level + 1);
          return {
            ...node,
            children: [...(node.children || []), updatedTargetNode]
          };
        }
      }
      
      if (node.children) {
        return {
          ...node,
          children: node.children.map(findAndUpdateNodes)
        };
      }
      return node;
    };

    // Helper to find node by ID
    const findNodeById = (node: ConfigNode, id: string): ConfigNode | null => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }
      return null;
    };

    return {
      config: findAndUpdateNodes(state.config),
      linkingNode: null,
      hasUnsavedChanges: true
    };
  }),

  cancelLinking: () => set({ linkingNode: null }),

  markChangesSaved: () => set({ hasUnsavedChanges: false }),

  saveConfig: () => {
    const state = get();
    const configToSave = {
      config: state.config,
      positions: state.positions,
      orientation: state.orientation
    };
    
    const blob = new Blob([JSON.stringify(configToSave, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zsh-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    set({ hasUnsavedChanges: false });
  },

  loadConfig: (loadedConfig: ConfigNode) => {
    set((state) => {
      const positions: Record<string, Position> = {
        [loadedConfig.id]: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
      };
      
      const calculatePositions = (node: ConfigNode, depth: number = 0, index: number = 0) => {
        if (node.children) {
          node.children.forEach((child, i) => {
            positions[child.id] = {
              x: INITIAL_OFFSET.x + (depth + 1) * NODE_SPACING,
              y: INITIAL_OFFSET.y + i * NODE_SPACING
            };
            calculatePositions(child, depth + 1, i);
          });
        }
      };
      
      calculatePositions(loadedConfig);
      
      return {
        config: loadedConfig,
        positions,
        hasUnsavedChanges: false
      };
    });
  }
}));