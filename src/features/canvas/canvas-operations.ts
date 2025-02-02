import { ConfigNode, Position } from '../../types/config'
import { StateCreator } from 'zustand'
import { CanvasState } from './canvas-slice'

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

export const addNewNode = (
    state: CanvasState,
    type: 'injector' | 'partial',
    template?: ConfigNode
) => {
    const findFreePosition = (basePosition: Position): Position => {
        const isPositionValid = (pos: Position): boolean => {
            if (pos.x < CANVAS.PADDING || pos.x > CANVAS.WIDTH - CANVAS.PADDING) return false
            if (pos.y < CANVAS.PADDING || pos.y > CANVAS.HEIGHT - CANVAS.PADDING) return false

            return !Object.values(state.positions).some(nodePos => {
                const xDiff = Math.abs(nodePos.x - pos.x)
                const yDiff = Math.abs(nodePos.y - pos.y)
                return xDiff < SPACING.NODE && yDiff < SPACING.VERTICAL
            })
        }

        let position = { ...basePosition }
        position.x = Math.round(position.x / SPACING.GRID_SNAP) * SPACING.GRID_SNAP
        position.y = Math.round(position.y / SPACING.GRID_SNAP) * SPACING.GRID_SNAP

        if (!isPositionValid(position)) {
            let ring = 1
            while (ring < 20) {
                for (let dx = -ring; dx <= ring; dx++) {
                    for (let dy = -ring; dy <= ring; dy++) {
                        if (Math.abs(dx) === ring || Math.abs(dy) === ring) {
                            const testPos = {
                                x: position.x + dx * SPACING.NODE,
                                y: position.y + dy * SPACING.VERTICAL
                            }
                            if (isPositionValid(testPos)) {
                                return testPos
                            }
                        }
                    }
                }
                ring++
            }
            return {
                x: CANVAS.PADDING + Math.random() * (CANVAS.WIDTH - 2 * CANVAS.PADDING),
                y: CANVAS.PADDING + Math.random() * (CANVAS.HEIGHT - 2 * CANVAS.PADDING)
            }
        }
        return position
    }

    const newNode = {
        id: Math.random().toString(36).substring(2, 15),
        title: template ? template.title : type === 'injector' ? 'new_injector.sh' : 'new_partial.sh',
        content: template ? template.content : '# New file content',
        type,
        level: type === 'injector' ? 1 : 2,
        children: type === 'injector' ? [] : undefined,
        connections: []
    }

    const freePosition = findFreePosition(state.quickAddPosition)

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
}

export const removeNodeFromTree = (node: ConfigNode, id: string): ConfigNode => {
    if (node.children) {
        return {
            ...node,
            children: node.children.filter(child => child.id !== id).map(child => removeNodeFromTree(child, id))
        }
    }
    return node
}

export const updateNodeInTree = (node: ConfigNode, id: string, updates: Partial<ConfigNode>): ConfigNode => {
    if (node.id === id) {
        return { ...node, ...updates }
    }
    if (node.children) {
        return {
            ...node,
            children: node.children.map(child => updateNodeInTree(child, id, updates))
        }
    }
    return node
}

export const handleNodeLinking = (state: CanvasState, targetId: string) => {
    const { id: sourceId, type } = state.linkingNode!
    const sourceNode = findNodeById(state.config, sourceId)
    const targetNode = findNodeById(state.config, targetId)

    if (!sourceNode || !targetNode) return state

    const updatedConfig = {
        ...state.config,
        connections: [
            ...(state.config.connections || []),
            { source: sourceId, target: targetId, type }
        ]
    }

    return {
        config: updatedConfig,
        linkingNode: null,
        hasUnsavedChanges: true
    }
}

export const handleConfigSave = (state: CanvasState, set: StateCreator<CanvasState>) => {
    const configToSave = {
        config: state.config,
        positions: state.positions,
        orientation: state.orientation
    }

    const blob = new Blob([JSON.stringify(configToSave, null, 2)], { type: 'application/json' })
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
}

export const handleConfigLoad = (loadedConfig: ConfigNode, set: StateCreator<CanvasState>) => {
    const positions: Record<string, Position> = {
        [loadedConfig.id]: SPACING.INITIAL_OFFSET
    }

    const calculatePositions = (node: ConfigNode, depth: number = 0) => {
        if (node.children) {
            const totalHeight = (node.children.length - 1) * SPACING.VERTICAL
            const startY = SPACING.INITIAL_OFFSET.y - totalHeight / 2

            node.children.forEach((child, i) => {
                positions[child.id] = {
                    x: SPACING.INITIAL_OFFSET.x + depth * SPACING.NODE,
                    y: startY + i * SPACING.VERTICAL
                }
                calculatePositions(child, depth + 1)
            })
        }
    }

    calculatePositions(loadedConfig)

    set({
        config: loadedConfig,
        positions,
        hasUnsavedChanges: false,
        lastSavedConfig: loadedConfig
    })
}

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