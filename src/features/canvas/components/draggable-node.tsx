// React and third-party imports
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { File, Edit2, Link, Trash2 } from 'lucide-react'

import MonacoEditorModal from './monaco-editor'
import { useCanvasStore } from '../canvas-slice'
import { ConfigNode, Position } from '../../../types/config'

interface Props {
    node: ConfigNode
    position: Position
    onUpdate: (id: string, updates: Partial<ConfigNode>) => void
    onPositionChange: (id: string, position: Position) => void
    onDrag: (id: string, position: Position) => void
    onDelete?: (id: string) => void
    onLink?: (id: string) => void
}

export function DraggableNode({
    node,
    position,
    onUpdate,
    onPositionChange,
    onDrag,
    onDelete,
    onLink
}: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [showEditor, setShowEditor] = React.useState(false)
    const { linkingNode, finishLinking } = useCanvasStore()
    const nodeRef = useRef<HTMLDivElement>(null)

    // const sourceFiles = node.content.match(/source.*\.sh/g) || [];
    // const isLinking = linkingNode !== null;

    const getNodeColors = () => {
        switch (node.type) {
            case 'main':
                return 'border-white/20 bg-white/[0.06]'
            case 'injector':
                return 'border-white/15 bg-white/[0.04]'
            case 'partial':
                return 'border-white/10 bg-white/[0.02]'
        }
    }

    const handleDrag = (_: DraggableEvent, data: DraggableData) => {
        onDrag(node.id, { x: data.x, y: data.y })
    }

    const handleStop = (_: DraggableEvent, data: DraggableData) => {
        onPositionChange(node.id, { x: data.x, y: data.y })
    }

    const updateSourceCommands = (mainNode: ConfigNode, injectorTitle: string) => {
        const sourceCommand = `source "${injectorTitle}.sh"\n`

        if (!mainNode.content.includes(sourceCommand)) {
            const updatedContent = mainNode.content + sourceCommand
            onUpdate(mainNode.id, { content: updatedContent })
        }
    }

    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (linkingNode && linkingNode.id !== node.id) {
            if (
                (linkingNode.type === 'parent' && node.type === 'injector') ||
                (node.type === 'main' && linkingNode.type === 'child')
            ) {
                finishLinking(node.id)

                // When linking an injector to main node
                if (linkingNode.type === 'parent') {
                    onUpdate(linkingNode.id, {
                        content: (linkingNode.content || '') + `source "${node.title}.sh"\n`
                    })
                }
                // When linking from child to main node
                else if (node.type === 'main') {
                    const linkingTitle = (linkingNode as unknown as { title: string }).title
                    onUpdate(node.id, {
                        content: (node.content || '') + `source "${linkingTitle}.sh"\n`
                    })
                }
            }
        }
    }

    const handleTitleChange = (newTitle: string) => {
        onUpdate(node.id, { title: newTitle })

        const connections = node.connections || []
        if (node.type === 'injector' && connections.length > 0) {
            const mainNode = connections.find(id => {
                const connectedNode = document.querySelector(`[data-node-id="${id}"]`)
                return connectedNode?.getAttribute('data-node-type') === 'main'
            })

            if (mainNode) {
                const mainConfig: ConfigNode = {
                    id: mainNode,
                    type: 'main',
                    content: '',
                    title: 'main',
                    level: 0,
                    connections: []
                }
                updateSourceCommands(mainConfig, newTitle)
            }
        }
    }

    // Add this new function to determine if shell helpers should be disabled
    const isShellHelpersDisabled = node.type === 'main'

    return (
        <>
            <Draggable
                nodeRef={nodeRef}
                position={position}
                onDrag={handleDrag}
                onStop={handleStop}
                bounds='parent'
                handle='.drag-handle'
            >
                <div
                    ref={nodeRef}
                    className='absolute'
                    data-node-id={node.id}
                    data-node-type={node.type}
                    onClick={handleNodeClick}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`w-fit rounded-lg border ${getNodeColors()} backdrop-blur-sm shadow-lg shadow-black/20`}
                    >
                        <div className='drag-handle flex items-center justify-between px-3 py-2 border-b border-white/5 cursor-move'>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center justify-center w-4 h-4 rounded-sm bg-white/[0.06] border border-white/10'>
                                    <span className='text-[10px] text-white/50 font-mono'>
                                        {node.level}
                                    </span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type='text'
                                        value={node.title}
                                        onChange={e => handleTitleChange(e.target.value)}
                                        onBlur={() => setIsEditing(false)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter') {
                                                setIsEditing(false)
                                                handleTitleChange(e.currentTarget.value)
                                            }
                                            if (e.key === 'Escape') setIsEditing(false)
                                        }}
                                        className='bg-black/20 text-white text-sm px-2 py-0.5 rounded w-32 border border-white/10 focus:border-white/20 outline-none'
                                        autoFocus
                                    />
                                ) : (
                                    <span className='text-sm text-white/80 font-medium truncate'>
                                        {node.title}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center gap-0.5'>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className='p-1 text-white/40 hover:text-white/90 transition-colors rounded hover:bg-white/[0.06]'
                                >
                                    <Edit2 className='w-3 h-3' />
                                </button>
                                {node.type !== 'main' && (
                                    <>
                                        <button
                                            onClick={() => onLink?.(node.id)}
                                            className='p-1 text-white/40 hover:text-white/90 transition-colors rounded hover:bg-white/[0.06]'
                                        >
                                            <Link className='w-3 h-3' />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(node.id)}
                                            className='p-1 text-white/40 hover:text-white/90 transition-colors rounded hover:bg-white/[0.06]'
                                        >
                                            <Trash2 className='w-3 h-3' />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowEditor(true)}
                            className='w-full px-3 py-2 text-left hover:bg-white/[0.03] transition-colors group'
                        >
                            <div className='flex items-center gap-2 text-white/40 group-hover:text-white/70'>
                                <File className='w-3.5 h-3.5' />
                                <span className='text-[11px]'>Edit Contents</span>
                            </div>
                        </button>
                    </motion.div>
                </div>
            </Draggable>

            <MonacoEditorModal
                isOpen={showEditor}
                onClose={() => setShowEditor(false)}
                title={node.title}
                content={node.content}
                onSave={content => {
                    onUpdate(node.id, { content })
                    setShowEditor(false)
                }}
                disableShellHelpers={isShellHelpersDisabled}
                isMainNode={node.type === 'main'}
            />
        </>
    )
}
