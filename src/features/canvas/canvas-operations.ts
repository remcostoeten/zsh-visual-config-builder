import { ConfigNode, Position, NodeType } from '@/types/config'
import { generateId } from '@/utils/generateId'
import { githubGistService } from '../persistence/github-gist'
import { useAuthStore } from '@/features/auth/github-auth'

interface CanvasState {
    config: ConfigNode
    positions: Record<string, Position>
    orientation: string
    hasUnsavedChanges: boolean
    lastSavedConfig: ConfigNode | null
}

const SPACING = {
    NODE: 250,
    VERTICAL: 150,
    GRID_SNAP: 20,
    INITIAL_OFFSET: { x: 100, y: 100 }
} as const

export const addNewNode = (
    type: NodeType,
    nodes: ConfigNode[],
    parentId?: string
): ConfigNode => {
    const newNode: ConfigNode = {
        id: generateId(),
        title: type === 'injector' 
            ? `${type}_${nodes.length + 1}.sh`
            : type === 'partial'
                ? `${type}_${nodes.length + 1}.sh`
                : '.zshrc',
        content: getInitialContent(type),
        type,
        level: parentId ? getNodeLevel(parentId, nodes) + 1 : 0,
        children: type === 'injector' ? [] : undefined,
        main: ['zshrc', 'injector', 'partial'] as ['zshrc', 'injector', 'partial'],
        connections: []
    }

    // If it's a partial, it must have an injector parent
    if (type === 'partial' && !parentId) {
        throw new Error('Partial nodes must have an injector parent')
    }

    // If parent is specified, add the node as a child
    if (parentId) {
        const parent = findNodeById(parentId, nodes)
        if (!parent) throw new Error('Parent node not found')
        
        // Only allow partials to be children of injectors
        if (parent.type !== 'injector' && type === 'partial') {
            throw new Error('Partial nodes can only be children of injector nodes')
        }

        parent.children = parent.children || []
        parent.children.push(newNode)
    } else {
        nodes.push(newNode)
    }

    return newNode
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

export const handleNodeLinking = (
    sourceId: string,
    targetId: string,
    nodes: ConfigNode[]
): ConfigNode[] => {
    const sourceNode = findNodeById(sourceId, nodes)
    const targetNode = findNodeById(targetId, nodes)

    if (!sourceNode || !targetNode) {
        throw new Error('Source or target node not found')
    }

    // Only allow linking partials to injectors
    if (sourceNode.type === 'partial' && targetNode.type !== 'injector') {
        throw new Error('Partial nodes can only be linked to injector nodes')
    }

    // Remove from previous parent if exists
    removeFromParent(sourceNode, nodes)

    // Add to new parent
    if (targetNode.type === 'injector') {
        targetNode.children = targetNode.children || []
        targetNode.children.push(sourceNode)
        sourceNode.level = targetNode.level + 1
    }

    return [...nodes]
}

export const handleConfigSave = async (state: CanvasState, set: any) => {
    const { isAuthenticated, token } = useAuthStore.getState()
    
    if (!isAuthenticated || !token) {
        throw new Error('Authentication required to save to GitHub')
    }

    const configToSave = {
        config: state.config,
        positions: state.positions,
        orientation: state.orientation
    }

    try {
        await githubGistService.saveConfig(configToSave, token)
        
        set({
            hasUnsavedChanges: false,
            lastSavedConfig: state.config
        })
    } catch (error) {
        throw error
    }
}

export const handleConfigLoad = (loadedConfig: ConfigNode, set: any) => {
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

export const findNodeById = (id: string, nodes: ConfigNode[]): ConfigNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node
        if (node.children) {
            const found = findNodeById(id, node.children)
            if (found) return found
        }
    }
    return null
}

const getNodeLevel = (parentId: string, nodes: ConfigNode[]): number => {
    const parent = findNodeById(parentId, nodes)
    return parent ? parent.level : 0
}

const removeFromParent = (node: ConfigNode, nodes: ConfigNode[]) => {
    for (const n of nodes) {
        if (n.children) {
            const index = n.children.findIndex(child => child.id === node.id)
            if (index !== -1) {
                n.children.splice(index, 1)
                return
            }
            removeFromParent(node, n.children)
        }
    }
}

const getInitialContent = (type: NodeType): string => {
    switch (type) {
        case 'injector':
            return '# Injector Configuration\n\n# Source your partial configurations here'
        case 'partial':
            return '# Partial Configuration\n\n# Add your shell commands here'
        default:
            return '# Shell Configuration\n\n# This is your main shell configuration file\n# It will source all your injector files\n\n# Create configuration directories\n[ ! -d ~/.zsh ] && mkdir -p ~/.zsh\n'
    }
} 