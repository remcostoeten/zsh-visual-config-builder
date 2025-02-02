import { create } from 'zustand'
import { ConfigNode, Position } from '../../types/config'
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
    config: ConfigNode
    positions: Record<string, Position>
    quickAddPosition: Position | null
    isZenMode: boolean
    orientation: 'normal' | 'horizontal' | 'vertical'
    hasUnsavedChanges: boolean
    linkingNode: { id: string; type: 'parent' | 'child' } | null
    lastSavedConfig: ConfigNode
    nodes: NodeState[]

    // Actions
    setConfig: (nodes: ConfigNode[]) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    updateNode: (id: string, updates: Partial<ConfigNode>) => void
    setQuickAddPosition: (position: Position | null) => void
    setZenMode: (isZenMode: boolean) => void
    cycleOrientation: () => void
    clearCanvas: () => void
    addNode: (type: 'injector' | 'partial', template?: ConfigNode) => void
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
            config: {
              id: 'main',
              title: '.zshrc',
              content: '',
              level: 0,
              type: 'main',
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
              content: '  ',
              level: 0,
              type: 'main',
              children: [],
              connections: []
            },
            nodes: [],

            // Basic Actions
            setConfig: nodes => set({ nodes }),
            setQuickAddPosition: position => set({ quickAddPosition: position }),
            setZenMode: isZenMode => set({ isZenMode }),
            setPositions: positions => set({ positions }),
            cancelLinking: () => set({ linkingNode: null }),

            // Node Position Updates
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
                const { nodes } = get()
                localStorage.setItem('node-positions', JSON.stringify(nodes))
            },

            // Node Content Updates
            updateNode: (id, updates) =>
                set(state => ({
                    config: updateNodeInTree(state.config, id, updates),
                    hasUnsavedChanges: true
                })),

            // Canvas Actions
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

            // Node Management
            addNode: (type: NodeType, position: Position) => {
                const state = get()
                
                // Only allow partial creation if there's at least one injector
                if (type === 'partial') {
                    const hasInjector = Object.values(state.nodes).some(node => node.type === 'injector')
                    if (!hasInjector) {
                        toast.error('You need at least one injector to add partials')
                        return
                    }
                }

                const id = nanoid()
                const newNode: ConfigNode = {
                    id,
                    type,
                    title: type === 'main' ? '.zshrc' : `${type}_${Object.keys(state.nodes).length + 1}`,
                    content: '',
                    level: type === 'main' ? 0 : type === 'injector' ? 1 : 2,
                    connections: []
                }

                set(state => ({
                    nodes: {
                        ...state.nodes,
                        [id]: newNode
                    }
                }))

                return id
            },

            removeNode: id =>
                set(state => {
                    const newPositions = { ...state.positions }
                    delete newPositions[id]
                    return {
                        config: removeNodeFromTree(state.config, id),
                        positions: newPositions,
                        hasUnsavedChanges: true
                    }
                }),

            // Linking System
            startLinking: (id, type) => set({ linkingNode: { id, type } }),
            finishLinking: targetId => {
                const state = get()
                const { addToast } = useToast()
                const sourceNode = state.nodes[state.linkingNode!.id]
                const targetNode = state.nodes[targetId]

                // Only allow injectors to source partials
                if (sourceNode.type === 'injector' && targetNode.type !== 'partial') {
                    addToast('Injectors can only source partial nodes', 'error')
                    set({ linkingNode: null })
                    return
                }

                // Only allow partials to be linked to injectors
                if (targetNode.type === 'partial' && sourceNode.type !== 'injector') {
                    addToast('Partials can only be linked to injector nodes', 'error')
                    set({ linkingNode: null })
                    return
                }

                set(state => ({
                    nodes: {
                        ...state.nodes,
                        [state.linkingNode!.id]: {
                            ...sourceNode,
                            connections: [...(sourceNode.connections || []), targetId]
                        },
                        [targetId]: {
                            ...targetNode,
                            connections: [...(targetNode.connections || []), state.linkingNode!.id]
                        }
                    },
                    linkingNode: null
                }))

                // Add source command if it's an injector sourcing a partial
                if (sourceNode.type === 'injector' && targetNode.type === 'partial') {
                    const sourceCommand = `source "${targetNode.title}.sh"\n`
                    if (!sourceNode.content.includes(sourceCommand)) {
                        get().updateNode(sourceNode.id, {
                            content: sourceNode.content + sourceCommand
                        })
                    }
                }
            },

            // Save/Load
            markChangesSaved: () =>
                set(state => ({
                    hasUnsavedChanges: false,
                    lastSavedConfig: state.config
                })),

            saveConfig: () => handleConfigSave(get(), set),
            loadConfig: loadedConfig => handleConfigLoad(loadedConfig, set)
        }),
        {
            name: 'canvas-storage'
        }
    )
)
