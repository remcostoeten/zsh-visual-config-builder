export type NodeType = 'main' | 'injector' | 'partial' | 'zsh' | 'bash' | 'fish'

export interface ConfigNode {
    id: string
    title: string
    content: string
    type: NodeType
    main: ['zshrc', 'injector', 'partial']
    level: number
    connections: string[]
    children?: ConfigNode[]
    width?: number
    height?: number
    color?: string
}

export interface Position {
    x: number
    y: number
}

export interface CanvasState {
    config: ConfigNode
    nodes: ConfigNode[]
    positions: Record<string, Position>
    quickAddPosition: Position | null
    linkingNode: ConfigNode | null
    isZenMode: boolean
    orientation: 'normal' | 'horizontal' | 'vertical'
    hasUnsavedChanges: boolean
    lastSavedConfig: ConfigNode
    setConfig: (config: ConfigNode[]) => void
    setNodes: (nodes: ConfigNode[]) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    updateNode: (id: string, updates: Partial<ConfigNode>) => void
    setQuickAddPosition: (position: Position | null) => void
    addNode: (type: NodeType, position: Position) => string
    cancelLinking: () => void
    setLinkingNode: (node: ConfigNode | null) => void
    cycleOrientation: () => void
    setZenMode: (isZenMode: boolean) => void
    clearCanvas: () => void
    resetPositions: () => void
}
