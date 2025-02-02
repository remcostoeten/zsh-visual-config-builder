import { create } from 'zustand'
import { ConfigNode, Position, NodeType } from '../../types/config'
import { persist } from 'zustand/middleware'
import { 
    addNewNode,
    removeNodeFromTree,
    updateNodeInTree,
    handleNodeLinking,
    handleConfigSave,
    handleConfigLoad 
} from './canvas-operations'
import { useToast } from "../../components/ui/toast"
import { nanoid } from 'nanoid'

// Constants
const SPACING = {
    NODE: 250,
    VERTICAL: 150,
    GRID_SNAP: 20,
    INITIAL_OFFSET: { x: 100, y: 100 }
} as const

const CANVAS = {
    PADDING: 50,
    WIDTH: 3000,
    HEIGHT: 2000
} as const

// Types
interface NodeState extends ConfigNode {
    position?: Position
}

interface CanvasState {
    // State
    nodes: NodeState[]
    config: ConfigNode
    positions: Record<string, Position>
    quickAddPosition: Position | null
    isZenMode: boolean
    orientation: 'normal' | 'horizontal' | 'vertical'
    hasUnsavedChanges: boolean
    linkingNode: { id: string; type: 'parent' | 'child' } | null
    lastSavedConfig: ConfigNode

    // Actions
    setConfig: (nodes: ConfigNode[]) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    updateNode: (id: string, updates: Partial<ConfigNode>) => void
    setQuickAddPosition: (position: Position | null) => void
    setZenMode: (isZenMode: boolean) => void
    cycleOrientation: () => void
    clearCanvas: () => void
    addNode: (type: NodeType, position: Position) => string
    removeNode: (id: string) => void
    startLinking: (id: string, type: 'parent' | 'child') => void
    finishLinking: (targetId: string) => void
    cancelLinking: () => void
    markChangesSaved: () => void
    saveConfig: () => void
    loadConfig: (config: ConfigNode) => void
    setNodePosition: (id: string, position: Position) => void
    setPositions: (positions: Record<string, Position>) => void
}

// Helper Functions
const generateId = () => Math.random().toString(36).substring(2, 15)

const findNodeById = (node: ConfigNode, id: string): ConfigNode | null => {
    if (node.id === id) return node
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeById(child, id)
            if (found) return found
        }
    }
    return null
}

const updateNodeLevel = (node: ConfigNode, level: number): ConfigNode => {
    const updatedNode = { ...node, level }
    if (node.children) {
        updatedNode.children = node.children.map(child => updateNodeLevel(child, level + 1))
    }
    return updatedNode
}

// Store Creation
export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            // Initial State
            nodes: [],
            config: {
                id: 'main',
                title: '.zshrc',
                content: '',
                type: 'main',
                level: 0,
                children: [],
                connections: []
            },
            positions: {
                main: SPACING.INITIAL_OFFSET
            },
            quickAddPosition: null,
            isZenMode: false,
            orientation: 'normal',
            hasUnsavedChanges: false,
            linkingNode: null,
            lastSavedConfig: {
                id: 'main',
                title: '.zshrc',
                content: '',
                type: 'main',
                level: 0,
                children: [],
                connections: []
            },

            // Actions
            setConfig: (nodes) => set({ nodes }),
            setQuickAddPosition: (position) => set({ quickAddPosition: position }),
            setZenMode: (isZenMode) => set({ isZenMode }),
            setPositions: (positions) => set({ positions }),
            cancelLinking: () => set({ linkingNode: null }),

            updateNodePosition: (id, x, y) =>
                set(state => ({
                    positions: {
                        ...state.positions,
                        [id]: { x, y }
                    },
                    hasUnsavedChanges: true
                })),

            setNodePosition: (id, position) => {
                set(state => ({
                    nodes: state.nodes.map(node => 
                        node.id === id ? { ...node, position } : node
                    )
                }))
            },

            updateNode: (id, updates) =>
                set(state => ({
                    nodes: state.nodes.map(node =>
                        node.id === id ? { ...node, ...updates } : node
                    ),
                    hasUnsavedChanges: true
                })),

            cycleOrientation: () =>
                set(state => ({
                    orientation: state.orientation === 'normal' 
                        ? 'horizontal' 
                        : state.orientation === 'horizontal'
                            ? 'vertical'
                            : 'normal'
                })),

            clearCanvas: () =>
                set({
                    nodes: [],
                    config: {
                        id: 'main',
                        title: '.zshrc',
                        content: '',
                        type: 'main',
                        level: 0,
                        children: [],
                        connections: []
                    },
                    positions: {
                        main: SPACING.INITIAL_OFFSET
                    },
                    hasUnsavedChanges: true
                }),

            addNode: (type, position) => {
                const id = nanoid()
                const newNode: NodeState = {
                    id,
                    type,
                    title: `${type}_${get().nodes.length + 1}`,
                    content: '',
                    level: type === 'main' ? 0 : type === 'injector' ? 1 : 2,
                    connections: [],
                    position
                }

                set(state => ({
                    nodes: [...state.nodes, newNode],
                    positions: {
                        ...state.positions,
                        [id]: position
                    },
                    hasUnsavedChanges: true
                }))

                return id
            },

            removeNode: (id) =>
                set(state => ({
                    nodes: state.nodes.filter(node => node.id !== id),
                    positions: Object.fromEntries(
                        Object.entries(state.positions).filter(([key]) => key !== id)
                    ),
                    hasUnsavedChanges: true
                })),

            startLinking: (id, type) => set({ linkingNode: { id, type } }),
            finishLinking: (targetId) => set({ linkingNode: null }),
            markChangesSaved: () => set(state => ({
                hasUnsavedChanges: false,
                lastSavedConfig: state.config
            })),
            saveConfig: () => {
                const state = get()
                // Implement save logic here
                set({ hasUnsavedChanges: false })
            },
            loadConfig: (config) => set({
                config,
                hasUnsavedChanges: false,
                lastSavedConfig: config
            })
        }),
        {
            name: 'canvas-storage'
        }
    )
)
