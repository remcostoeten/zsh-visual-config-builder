import { create } from 'zustand'
import { ConfigNode, Position } from '../../types/config'

// Inline the function until we resolve import issues
const generateId = () => Math.random().toString(36).substring(2, 15)

interface CanvasState {
    config: ConfigNode
    positions: Record<string, Position>
    quickAddPosition: Position | null
    isZenMode: boolean
    orientation: 'normal' | 'horizontal' | 'vertical'
    hasUnsavedChanges: boolean
    linkingNode: { id: string; type: 'parent' | 'child' } | null
    lastSavedConfig: ConfigNode
    setConfig: (config: ConfigNode) => void
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
}

// Update the constants for better spacing
const NODE_SPACING = 250 // Reduced from 300
const VERTICAL_SPACING = 150 // Reduced from 200
const INITIAL_OFFSET = { x: 100, y: 100 } // Increased from 50,50
const GRID_SNAP = 20 // Add grid snap constant

// Add constants for canvas bounds
const CANVAS_PADDING = 50 // Padding from canvas edges
const CANVAS_WIDTH = 3000 // Maximum canvas width
const CANVAS_HEIGHT = 2000 // Maximum canvas height

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
    lastSavedConfig: {
        id: 'main',
        title: '.zshrc',
        content: '',
        level: 0,
        type: 'main',
        children: []
    },

    setConfig: config => {
        const positions: Record<string, Position> = {
            [config.id]: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
        }

        const calculatePositions = (node: ConfigNode, depth: number = 0) => {
            if (node.children) {
                // Calculate total height needed for children
                const totalHeight = (node.children.length - 1) * VERTICAL_SPACING
                // Start position for first child
                const startY = INITIAL_OFFSET.y - totalHeight / 2

                node.children.forEach((child, i) => {
                    positions[child.id] = {
                        x: INITIAL_OFFSET.x + depth * NODE_SPACING,
                        y: startY + i * VERTICAL_SPACING
                    }
                    calculatePositions(child, depth + 1)
                })
            }
        }

        calculatePositions(config)
        set({ config, positions, hasUnsavedChanges: true })
    },

    updateNodePosition: (id, x, y) =>
        set(state => ({
            positions: {
                ...state.positions,
                [id]: { x, y }
            },
            hasUnsavedChanges: true
        })),

    updateNode: (id, updates) =>
        set(state => {
            const updateNode = (node: ConfigNode): ConfigNode => {
                if (node.id === id) {
                    return { ...node, ...updates }
                }
                if (node.children) {
                    return {
                        ...node,
                        children: node.children.map(updateNode)
                    }
                }
                return node
            }
            return {
                config: updateNode(state.config),
                hasUnsavedChanges: true
            }
        }),

    setQuickAddPosition: position => set({ quickAddPosition: position }),

    setZenMode: isZenMode => set({ isZenMode }),

    cycleOrientation: () =>
        set(state => ({
            orientation:
                state.orientation === 'normal'
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
                children: []
            },
            positions: {
                main: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
            },
            hasUnsavedChanges: true
        }),

    addNode: (type: 'injector' | 'partial', template?: ConfigNode) =>
        set(state => {
            if (!state.quickAddPosition) return state

            // Update findFreePosition function
            const findFreePosition = (basePosition: Position): Position => {
                const isPositionValid = (pos: Position): boolean => {
                    // Check if position is within canvas bounds
                    if (pos.x < CANVAS_PADDING || pos.x > CANVAS_WIDTH - CANVAS_PADDING)
                        return false
                    if (pos.y < CANVAS_PADDING || pos.y > CANVAS_HEIGHT - CANVAS_PADDING)
                        return false

                    // Check if position is occupied by another node
                    return !Object.values(state.positions).some(nodePos => {
                        const xDiff = Math.abs(nodePos.x - pos.x)
                        const yDiff = Math.abs(nodePos.y - pos.y)
                        return xDiff < NODE_SPACING && yDiff < VERTICAL_SPACING
                    })
                }

                // Start with the clicked position
                let position = { ...basePosition }

                // Clamp position to canvas bounds
                position.x = Math.max(
                    CANVAS_PADDING,
                    Math.min(position.x, CANVAS_WIDTH - CANVAS_PADDING)
                )
                position.y = Math.max(
                    CANVAS_PADDING,
                    Math.min(position.y, CANVAS_HEIGHT - CANVAS_PADDING)
                )

                // Snap to grid
                position.x = Math.round(position.x / GRID_SNAP) * GRID_SNAP
                position.y = Math.round(position.y / GRID_SNAP) * GRID_SNAP

                // If position is occupied, spiral outward until we find a free spot
                if (!isPositionValid(position)) {
                    let ring = 1
                    let found = false
                    const maxRings = 20 // Increase max rings to find more positions

                    while (!found && ring < maxRings) {
                        // Try positions in a square pattern instead of spiral
                        for (let dx = -ring; dx <= ring; dx++) {
                            for (let dy = -ring; dy <= ring; dy++) {
                                // Only check positions on the perimeter of the square
                                if (Math.abs(dx) === ring || Math.abs(dy) === ring) {
                                    const testPos = {
                                        x: position.x + dx * NODE_SPACING,
                                        y: position.y + dy * VERTICAL_SPACING
                                    }

                                    // Snap to grid
                                    testPos.x = Math.round(testPos.x / GRID_SNAP) * GRID_SNAP
                                    testPos.y = Math.round(testPos.y / GRID_SNAP) * GRID_SNAP

                                    if (isPositionValid(testPos)) {
                                        position = testPos
                                        found = true
                                        break
                                    }
                                }
                            }
                            if (found) break
                        }
                        ring++
                    }

                    // If no position found, fall back to a safe default position
                    if (!found) {
                        position = {
                            x: CANVAS_PADDING + Math.random() * (CANVAS_WIDTH - 2 * CANVAS_PADDING),
                            y: CANVAS_PADDING + Math.random() * (CANVAS_HEIGHT - 2 * CANVAS_PADDING)
                        }
                        position.x = Math.round(position.x / GRID_SNAP) * GRID_SNAP
                        position.y = Math.round(position.y / GRID_SNAP) * GRID_SNAP
                    }
                }

                return position
            }

            const newNode = {
                id: generateId(),
                title: template
                    ? template.title
                    : type === 'injector'
                      ? 'new_injector.sh'
                      : 'new_partial.sh',
                content: template ? template.content : '# New file content',
                type,
                level: type === 'injector' ? 1 : 2,
                children: type === 'injector' ? [] : undefined
            }

            const freePosition = findFreePosition(state.quickAddPosition)

            // For partials, find the closest injector to add it to
            if (type === 'partial') {
                const findParentInjector = (node: ConfigNode): ConfigNode | null => {
                    if (node.type === 'injector') return node
                    if (!node.children) return null
                    for (const child of node.children) {
                        const found = findParentInjector(child)
                        if (found) return found
                    }
                    return null
                }

                const parentInjector = findParentInjector(state.config)
                if (!parentInjector) return state

                return {
                    config: {
                        ...state.config,
                        children:
                            state.config.children?.map(node =>
                                node.id === parentInjector.id
                                    ? { ...node, children: [...(node.children || []), newNode] }
                                    : node
                            ) || []
                    },
                    positions: {
                        ...state.positions,
                        [newNode.id]: freePosition
                    },
                    quickAddPosition: null,
                    hasUnsavedChanges: true
                }
            }

            // For injectors, add directly to root
            return {
                config: {
                    ...state.config,
                    children: [...(state.config.children || []), newNode]
                },
                positions: {
                    ...state.positions,
                    [newNode.id]: freePosition
                },
                quickAddPosition: null,
                hasUnsavedChanges: true
            }
        }),

    removeNode: id =>
        set(state => {
            const removeNodeFromTree = (node: ConfigNode): ConfigNode => {
                if (node.children) {
                    return {
                        ...node,
                        children: node.children
                            .filter(child => child.id !== id)
                            .map(removeNodeFromTree)
                    }
                }
                return node
            }

            const newPositions = { ...state.positions }
            delete newPositions[id]

            return {
                config: removeNodeFromTree(state.config),
                positions: newPositions,
                hasUnsavedChanges: true
            }
        }),

    startLinking: (id, type) => set({ linkingNode: { id, type } }),

    finishLinking: targetId =>
        set(state => {
            if (!state.linkingNode) return state

            const { id: sourceId, type } = state.linkingNode

            const findAndUpdateNodes = (node: ConfigNode): ConfigNode => {
                const updateNodeLevel = (node: ConfigNode, level: number): ConfigNode => {
                    const updatedNode = { ...node, level }
                    if (node.children) {
                        updatedNode.children = node.children.map(child =>
                            updateNodeLevel(child, level + 1)
                        )
                    }
                    return updatedNode
                }

                if (type === 'parent' && node.id === targetId) {
                    // Add as child to target node
                    const sourceNode = findNodeById(state.config, sourceId)
                    if (sourceNode) {
                        const updatedSourceNode = updateNodeLevel(sourceNode, node.level + 1)
                        return {
                            ...node,
                            children: [...(node.children || []), updatedSourceNode]
                        }
                    }
                } else if (type === 'child' && node.id === sourceId) {
                    // Add target node as child
                    const targetNode = findNodeById(state.config, targetId)
                    if (targetNode) {
                        const updatedTargetNode = updateNodeLevel(targetNode, node.level + 1)
                        return {
                            ...node,
                            children: [...(node.children || []), updatedTargetNode]
                        }
                    }
                }

                if (node.children) {
                    return {
                        ...node,
                        children: node.children.map(findAndUpdateNodes)
                    }
                }
                return node
            }

            // Helper to find node by ID
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

            return {
                config: findAndUpdateNodes(state.config),
                linkingNode: null,
                hasUnsavedChanges: true
            }
        }),

    cancelLinking: () => set({ linkingNode: null }),

    markChangesSaved: () =>
        set(state => ({
            hasUnsavedChanges: false,
            lastSavedConfig: state.config
        })),

    saveConfig: () => {
        const state = get()
        const configToSave = {
            config: state.config,
            positions: state.positions,
            orientation: state.orientation
        }

        const blob = new Blob([JSON.stringify(configToSave, null, 2)], {
            type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'zsh-config.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        set({
            hasUnsavedChanges: false,
            lastSavedConfig: state.config
        })
    },

    loadConfig: (loadedConfig: ConfigNode) => {
        set(() => {
            const positions: Record<string, Position> = {
                [loadedConfig.id]: { x: INITIAL_OFFSET.x, y: INITIAL_OFFSET.y }
            }

            const calculatePositions = (node: ConfigNode, depth: number = 0) => {
                if (node.children) {
                    const totalHeight = (node.children.length - 1) * VERTICAL_SPACING
                    const startY = INITIAL_OFFSET.y - totalHeight / 2

                    node.children.forEach((child, i) => {
                        positions[child.id] = {
                            x: INITIAL_OFFSET.x + depth * NODE_SPACING,
                            y: startY + i * VERTICAL_SPACING
                        }
                        calculatePositions(child, depth + 1)
                    })
                }
            }

            calculatePositions(loadedConfig)

            return {
                config: loadedConfig,
                positions,
                hasUnsavedChanges: false,
                lastSavedConfig: loadedConfig
            }
        })
    }
}))
