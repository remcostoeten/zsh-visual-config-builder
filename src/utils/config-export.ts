import { ConfigNode } from '../types/config'

interface ExportedConfig {
    version: string
    timestamp: number
    nodes: ConfigNode[]
    positions: Record<string, { x: number; y: number }>
    metadata?: {
        name?: string
        description?: string
        author?: string
    }
}

export const configExport = {
    exportToJson(
        nodes: ConfigNode[],
        positions: Record<string, { x: number; y: number }>,
        metadata?: ExportedConfig['metadata']
    ): string {
        const config: ExportedConfig = {
            version: '1.0.0',
            timestamp: Date.now(),
            nodes,
            positions,
            metadata
        }
        return JSON.stringify(config, null, 2)
    },

    validateImport(jsonString: string): { valid: boolean; error?: string } {
        try {
            const config = JSON.parse(jsonString)

            // Basic structure validation
            if (!config.version || !config.nodes || !config.positions) {
                return { valid: false, error: 'Invalid config format' }
            }

            // Version check
            if (!config.version.startsWith('1.')) {
                return { valid: false, error: 'Unsupported config version' }
            }

            // Validate nodes structure
            const validNodes = config.nodes.every((node: ConfigNode) => {
                return (
                    node.id &&
                    node.title &&
                    node.type &&
                    (node.type === 'injector' || node.type === 'partial')
                )
            })

            if (!validNodes) {
                return { valid: false, error: 'Invalid node structure' }
            }

            return { valid: true }
        } catch (e) {
            return { valid: false, error: 'Invalid JSON format' }
        }
    },

    importFromJson(jsonString: string): ExportedConfig {
        const validation = this.validateImport(jsonString)
        if (!validation.valid) {
            throw new Error(validation.error)
        }
        return JSON.parse(jsonString)
    }
}
