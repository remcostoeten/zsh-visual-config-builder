import { ConfigNode as ConfigNodeType } from '@/types/config'
import { useCanvasStore } from '../canvas-slice'
import { Button } from '@/shared/components/ui/button'
import { MonacoEditor } from '@/shared/components/ui/monaco-editor'
import { ColorPicker } from '@/shared/components/ui/color-picker'

interface ConfigNodeProps {
    node: ConfigNodeType
    position: { x: number; y: number }
}

export function ConfigNode({ node, position }: ConfigNodeProps) {
    const updateNode = useCanvasStore(state => state.updateNode)
    const removeNode = useCanvasStore(state => state.removeNode)

    return (
        <div
            className="absolute p-4 bg-white rounded-lg shadow-lg"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <input
                    type="text"
                    value={node.title}
                    onChange={e => updateNode(node.id, { title: e.target.value })}
                    className="text-lg font-semibold bg-transparent border-none focus:outline-none"
                />
                <div className="flex items-center gap-2">
                    <ColorPicker
                        color={node.color || '#000000'}
                        onChange={(color: string) => updateNode(node.id, { color })}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNode(node.id)}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <MonacoEditor
                value={node.content}
                onChange={(content: string) => updateNode(node.id, { content })}
                height={200}
            />
        </div>
    )
} 