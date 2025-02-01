import { useState, useCallback } from 'react'
import { ConfigNode } from '../types/config'

interface NodePosition {
    x: number
    y: number
}

interface NodePositions {
    [key: string]: NodePosition
}

const VERTICAL_SPACING = 180 // Increased vertical spacing between nodes
const HORIZONTAL_SPACING = 400 // Increased horizontal spacing for better connector visibility
const INITIAL_X = 50
const INITIAL_Y = 50

export function useNodePositions(config: ConfigNode) {
    const [positions, setPositions] = useState<NodePositions>(() => {
        const pos: NodePositions = {}

        // Calculate the maximum depth of the tree
        const getMaxDepth = (node: ConfigNode, currentDepth: number = 0): number => {
            if (!node.children?.length) return currentDepth
            return Math.max(...node.children.map(child => getMaxDepth(child, currentDepth + 1)))
        }

        // Calculate positions for each node
        const calculatePositions = (
            node: ConfigNode,
            depth: number = 0,
            parentIndex: number = 0,
            siblings: number = 1
        ) => {
            // Calculate x position based on depth
            const x = INITIAL_X + depth * HORIZONTAL_SPACING

            // Calculate y position based on node's position among siblings
            const totalHeight = siblings * VERTICAL_SPACING
            const startY = INITIAL_Y + parentIndex * totalHeight
            const y = startY + totalHeight / 2

            pos[node.id] = { x, y }

            // Process children
            if (node.children?.length) {
                const childSpacing = totalHeight / node.children.length
                node.children.forEach((child, index) => {
                    calculatePositions(child, depth + 1, index, node.children!.length)
                })
            }
        }

        calculatePositions(config)
        return pos
    })

    const updatePosition = useCallback((id: string, x: number, y: number) => {
        setPositions(prev => ({
            ...prev,
            [id]: { x, y }
        }))
    }, [])

    return { positions, updatePosition }
}
