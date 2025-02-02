import { create } from 'zustand'
import { ConfigNode, Position, NodeType } from '../../types/config'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { useAuthStore } from '../auth/github-auth'
import { githubGistService } from '../persistence/github-gist'
const SPACING = {
    NODE: 250,
    VERTICAL: 150,
    GRID_SNAP: 20,
    INITIAL_OFFSET: { x: 100, y: 100 }
} as const

interface NodeState extends ConfigNode {
    position: Position
}

interface CanvasState {
    // State
    nodes: NodeState[]
    config: ConfigNode
    positions: Record<string, Position>
    quickAddPosition: Position | null
    isZenMode: boolean
    orientation: 'horizontal' | 'vertical'
    hasUnsavedChanges: boolean
    linkingNode: { id: string; type: 'parent' | 'child' } | null
    lastSavedConfig: ConfigNode
    showWizard: boolean
    isCanvasLocked: boolean

    // Actions
    setConfig: (nodes: ConfigNode[]) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    updateNode: (id: string, updates: Partial<ConfigNode>) => void
    setQuickAddPosition: (position: Position | null) => void
    setZenMode: (isZenMode: boolean) => void
    cycleOrientation: () => void
    clearCanvas: () => void
    addNode: (type: NodeType, position: Position, template?: string) => string
    removeNode: (id: string) => void
    startLinking: (id: string, type: 'parent' | 'child') => void
    finishLinking: () => void
    cancelLinking: () => void
    markChangesSaved: () => void
    saveConfig: () => void
    loadConfig: (config: ConfigNode) => void
    setNodePosition: (id: string, position: Position) => void
    setPositions: (positions: Record<string, Position>) => void
    resetPositions: () => void
    toggleCanvasLock: () => void
    setShowWizard: (show: boolean) => void
}

// Helper Functions
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

const initialNode = {
    id: 'main',
    title: '.zshrc',
    content: '',
    type: 'zsh' as const,
    level: 0,
    children: [],
    connections: [],
    main: ['zshrc', 'injector', 'partial'] as ['zshrc', 'injector', 'partial']
}

const calculateNodePositions = (node: ConfigNode, startX = 100, startY = 100, spacing = { x: 250, y: 150 }) => {
    const positions: Record<string, Position> = {
        [node.id]: { x: startX, y: startY }
    }

    if (node.children) {
        node.children.forEach((child, index) => {
            const childX = startX + spacing.x
            const childY = startY + (index * spacing.y) - ((node.children?.length ?? 1) - 1) * spacing.y / 2
            
            const childPositions = calculateNodePositions(child, childX, childY, spacing)
            Object.assign(positions, childPositions)
        })
    }

    return positions
}

// Store Creation
export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            // Initial State
            nodes: [],
            config: initialNode,
            positions: {
                main: SPACING.INITIAL_OFFSET
            },
            quickAddPosition: null,
            isZenMode: false,
            orientation: 'horizontal' as const,
            hasUnsavedChanges: false,
            linkingNode: null,
            lastSavedConfig: { ...initialNode },
            showWizard: true,
            isCanvasLocked: false,
            // Actions
            setConfig: (config: ConfigNode[]) => {
                const mainConfig = config[0]
                const positions = calculateNodePositions(mainConfig)
                
                set({
                    config: mainConfig,
                    positions,
                    hasUnsavedChanges: true
                })
            },
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
                    orientation: state.orientation === 'horizontal'
                        ? 'vertical'
                        : 'horizontal'
                })),

            clearCanvas: () => set({
                config: {
                    id: 'main',
                    title: '.zshrc',
                    content: '',
                    type: 'zsh' as const,
                    level: 0,
                    children: [],
                    connections: [],
                    main: ['zshrc', 'injector', 'partial'] as const
                },
                nodes: [],
                positions: {},
                quickAddPosition: null,
                linkingNode: null,
                hasUnsavedChanges: false
            }),

            resetPositions: () => {
                const nodes = get().nodes
                const newPositions: Record<string, Position> = {}
                
                // Calculate grid positions
                nodes.forEach((node, index) => {
                    newPositions[node.id] = {
                        x: 200 + (index % 3) * 300,
                        y: 200 + Math.floor(index / 3) * 200
                    }
                })

                set({ positions: newPositions })
            },

            addNode: (type, position, template = '') => {
                const newNode: NodeState = {
                    id: nanoid(),
                    type,
                    title: `${type}_${get().nodes.length + 1}.sh`,
                    content: template || '',
                    level: type === 'zsh' ? 0 : type === 'injector' ? 1 : 2,
                    connections: [],
                    position,
                    children: type === 'injector' ? [] : undefined,
                    main: ['zshrc', 'injector', 'partial'] as const
                }

                // Only allow partial creation if there's at least one injector
                if (type === 'partial') {
                    const state = get()
                    const hasInjector = state.nodes.some(node => node.type === 'injector')
                    if (!hasInjector) {
                        console.warn('You need at least one injector to add partials')
                        return newNode.id
                    }
                }

                set(state => ({
                    nodes: [...state.nodes, newNode],
                    positions: {
                        ...state.positions,
                        [newNode.id]: position
                    },
                    config: {
                        ...state.config,
                        children: [...(state.config.children || []), newNode]
                    },
                    hasUnsavedChanges: true
                }))

                return newNode.id
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
            finishLinking: () => set({ linkingNode: null }),
            markChangesSaved: () => set(state => ({
                hasUnsavedChanges: false,
                lastSavedConfig: state.config
            })),
            saveConfig: async () => {
                const state = get()
                const { isAuthenticated, token } = useAuthStore.getState()

                // Local save
                set({
                    hasUnsavedChanges: false,
                    lastSavedConfig: state.config,
                    config: {
                        ...state.config,
                        children: state.nodes
                    }
                })

                // Save to GitHub if authenticated
                if (isAuthenticated && token) {
                    try {
                        await githubGistService.saveConfig({
                            config: state.config,
                            nodes: state.nodes,
                            positions: state.positions
                        }, token)
                    } catch (error) {
                        console.error('Failed to save to GitHub:', error)
                        // Could throw or handle error here
                    }
                }
            },
            loadConfig: (config) => set({
                config,
                hasUnsavedChanges: false,
                lastSavedConfig: config
            }),
            toggleCanvasLock: () => set(state => ({ isCanvasLocked: !state.isCanvasLocked })),
            setShowWizard: (show: boolean) => set(state => ({
                showWizard: show || state.nodes.length === 0
            })),
        }),
        {
            name: 'canvas-storage'
        }
    )
)
