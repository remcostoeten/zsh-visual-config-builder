import React, { useEffect, useState, useRef } from 'react'
import { useCanvasStore } from '../canvas-slice'
import { DraggableNode } from './draggable-node'
import { AnimatedConnector } from './animated-connector'
import { X, FlipHorizontal2, FlipVertical2, Trash2, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '../../settings/settings-slice'
import { QuickAddMenu } from './quick-add-menu'
import { ZenModeToolbar } from '../../../components/ZenModeToolbar'
import { ConfigNode, Position as CanvasPosition, NodeType } from '../../../types/config'
import { handleNodeLinking, findNodeById } from '../canvas-operations'
import { useAuthStore } from '@/features/auth/github-auth'
import { githubGistService } from '@/features/persistence/github-gist'
import { CanvasToolbar } from './canvas-toolbar'
import { DraggableWizard } from './draggable-wizard'
import { Toast } from '@/shared/components/ui/toast'

interface DragState {
    isDragging: boolean
    startX: number
    startY: number
    scrollLeft: number
    scrollTop: number
}

export function Canvas() {
    const {
        config,
        positions,
        quickAddPosition,
        linkingNode,
        isZenMode,
        orientation,
        updateNodePosition,
        updateNode,
        setQuickAddPosition,
        addNode,
        cancelLinking,
        setZenMode,
        cycleOrientation,
        nodes,
        clearCanvas,
        isCanvasLocked,
        showWizard,
        setShowWizard,
        startLinking,
        finishLinking
    } = useCanvasStore()

    const { settings } = useSettingsStore()
    const canvasRef = useRef<HTMLDivElement>(null)
    const [, setShowHint] = React.useState(true)
    const { token } = useAuthStore()
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0
    })

    // Hide hint when first node is added
    React.useEffect(() => {
        if (config.children && config.children.length > 0) {
            setShowHint(false)
        }
    }, [config.children])

    // Add escape handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isZenMode) {
                setZenMode(false)
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isZenMode, setZenMode])

    // Update the useEffect for showing wizard
    useEffect(() => {
        if (nodes.length === 0 && !showWizard) {
            setShowWizard(true)
        }
    }, [nodes.length, showWizard, setShowWizard])

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            if (linkingNode) {
                cancelLinking()
            }
        }
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left + canvasRef.current.scrollLeft
            const y = e.clientY - rect.top + canvasRef.current.scrollTop
            
            // Set position immediately and don't update it
            setQuickAddPosition({
                x: Math.round(x),
                y: Math.round(y)
            })
        }
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        if (e.target === canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect()
            setQuickAddPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
    }

    const renderConnectors = (node: ConfigNode) => {
        if (!node.children) return null
        return node.children.map((child: ConfigNode) => {
            const startPos = positions[node.id]
            const endPos = positions[child.id]
            if (!startPos || !endPos) return null

            return (
                <React.Fragment key={`${node.id}-${child.id}`}>
                    <AnimatedConnector start={startPos} end={endPos} settings={settings} />
                    {renderConnectors(child)}
                </React.Fragment>
            )
        })
    }

    const getOrientationStyles = () => {
        switch (orientation) {
            case 'horizontal':
                return 'scale-x-[-1]'
            case 'vertical':
                return 'scale-y-[-1]'
            default:
                return ''
        }
    }

    const getOrientationIcon = () => {
        switch (orientation) {
            case 'normal':
                return <FlipHorizontal2 className='w-5 h-5' />
            case 'horizontal':
                return <FlipVertical2 className='w-5 h-5' />
            case 'vertical':
                return <FlipHorizontal2 className='w-5 h-5' />
        }
    }

    const children = config.children || []

    const hasNodes = Object.keys(positions).length > 0 || children.length > 0

    const handleQuickAddSelect = (type: 'injector' | 'partial', parentId?: string) => {
        if (!quickAddPosition) return
        
        try {
            // Create initial content based on type
            const initialContent = type === 'injector' 
                ? '# Injector Configuration\n\n# Source your partial configurations here'
                : '# Partial Configuration\n\n# Add your shell commands here'

            // Add the node and get its ID
            const nodeId = addNode(type, quickAddPosition)
            
            // Update the node with initial content and title
            updateNode(nodeId, {
                content: initialContent,
                title: `${type}_${nodes.length + 1}.sh`
            })

            // If this is a partial and has a parent injector, handle the relationship
            if (type === 'partial' && parentId) {
                const updatedNodes = handleNodeLinking(nodeId, parentId, nodes)
                setNodes(updatedNodes)
                
                setToastState({
                    show: true,
                    state: 'success',
                    message: 'Partial added and linked to injector'
                })
                setTimeout(() => setToastState({ show: false, state: 'success' }), 3000)
            }
            
            setQuickAddPosition(null)
        } catch (error) {
            setToastState({
                show: true,
                state: 'initial',
                message: error instanceof Error ? error.message : 'Failed to add node'
            })
            setTimeout(() => setToastState({ show: false, state: 'initial' }), 3000)
        }
    }

    const [toastState, setToastState] = useState<{
        show: boolean;
        state: 'initial' | 'loading' | 'success';
        message?: string;
    }>({
        show: false,
        state: 'initial'
    })

    const handleStartLinking = (nodeId: string, type: 'parent' | 'child') => {
        const node = nodes.find(n => n.id === nodeId)
        if (!node) return

        // Only allow linking from injectors to partials or vice versa
        if (type === 'parent' && node.type !== 'injector') {
            toast({
                title: "Invalid Link",
                description: "Only injectors can be parent nodes",
                variant: "destructive"
            })
            return
        }

        if (type === 'child' && node.type !== 'partial') {
            toast({
                title: "Invalid Link",
                description: "Only partials can be child nodes",
                variant: "destructive"
            })
            return
        }

        startLinking(nodeId, type)
        toast({
            title: "Linking Mode",
            description: "Click another node to complete the link"
        })
    }

    const handleFinishLinking = (targetId: string) => {
        if (!linkingNode) return

        const sourceNode = nodes.find(n => n.id === linkingNode.id)
        const targetNode = nodes.find(n => n.id === targetId)

        if (!sourceNode || !targetNode) return

        // Prevent self-linking
        if (sourceNode.id === targetNode.id) {
            toast({
                title: "Invalid Link",
                description: "Cannot link a node to itself",
                variant: "destructive"
            })
            return
        }

        // Prevent invalid type combinations
        if (linkingNode.type === 'parent' && targetNode.type !== 'partial') {
            toast({
                title: "Invalid Link",
                description: "Injectors can only link to partials",
                variant: "destructive"
            })
            return
        }

        if (linkingNode.type === 'child' && targetNode.type !== 'injector') {
            toast({
                title: "Invalid Link",
                description: "Partials can only link to injectors",
                variant: "destructive"
            })
            return
        }

        // Update the nodes
        updateNode(sourceNode.id, {
            connections: [...sourceNode.connections, targetId]
        })

        toast({
            title: "Success",
            description: "Nodes linked successfully"
        })

        finishLinking()
    }

    const handleSaveToGist = async () => {
        if (!token) {
            setToastState({
                show: true,
                state: 'initial',
                message: 'Please sign in with GitHub to save configurations'
            })
            setTimeout(() => setToastState({ show: false, state: 'initial' }), 3000)
            return
        }

        try {
            setToastState({
                show: true,
                state: 'loading',
                message: 'Saving configuration...'
            })

            await githubGistService.saveConfig({
                config,
                positions,
                orientation
            }, token)
            
            setToastState({
                show: true,
                state: 'success',
                message: 'Configuration saved to GitHub Gist'
            })
            setTimeout(() => setToastState({ show: false, state: 'success' }), 3000)
        } catch (error) {
            setToastState({
                show: true,
                state: 'initial',
                message: 'Failed to save configuration'
            })
            setTimeout(() => setToastState({ show: false, state: 'initial' }), 3000)
        }
    }

    const handleClearCanvas = () => {
        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
            clearCanvas()
            setShowWizard(true)
        }
    }

    // Handle mouse down to start dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!canvasRef.current || isCanvasLocked) return
        
        // Only enable dragging with middle mouse button (button 1) or when holding space
        if (e.button !== 1 && e.button !== 0) return
        
        setDragState({
            isDragging: true,
            startX: e.pageX - canvasRef.current.offsetLeft,
            startY: e.pageY - canvasRef.current.offsetTop,
            scrollLeft: canvasRef.current.scrollLeft,
            scrollTop: canvasRef.current.scrollTop
        })
    }

    // Handle mouse move while dragging
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragState.isDragging || !canvasRef.current) return

        e.preventDefault()
        
        const x = e.pageX - canvasRef.current.offsetLeft
        const y = e.pageY - canvasRef.current.offsetTop
        
        const walkX = (x - dragState.startX) * 1.5 // Adjust speed multiplier as needed
        const walkY = (y - dragState.startY) * 1.5

        canvasRef.current.scrollLeft = dragState.scrollLeft - walkX
        canvasRef.current.scrollTop = dragState.scrollTop - walkY
    }

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setDragState(prev => ({ ...prev, isDragging: false }))
    }

    // Add space key handler for temporary drag mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                document.body.style.cursor = 'grab'
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                document.body.style.cursor = 'default'
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return (
        <div className="relative w-full h-full bg-[#1E1E1E]">
            <CanvasToolbar />
            <motion.div 
                className="flex-1 flex flex-col relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div
                    ref={canvasRef}
                    className={`absolute inset-0 bg-[#1E1E1E] rounded-md overflow-auto custom-scrollbar border border-[#333] m-2 mb-16 transition-transform duration-500 ${getOrientationStyles()}`}
                    onClick={handleCanvasClick}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                    style={{ 
                        cursor: dragState.isDragging ? 'grabbing' : 'default',
                        userSelect: 'none'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="relative h-full">
                        {nodes.length === 0 && (
                            <DraggableWizard 
                                isOpen={showWizard}
                                onClose={() => setShowWizard(false)}
                            />
                        )}
                        
                        {nodes.length > 0 && (
                            <>
                                {renderConnectors(config)}
                                {Object.entries(positions).map(([id, position]: [string, CanvasPosition]) => {
                                    const node = findNodeById(id, nodes)
                                    if (!node) return null

                                    return (
                                        <DraggableNode
                                            key={id}
                                            node={node}
                                            onUpdate={updateNode}
                                            onPositionChange={(id: string, pos: CanvasPosition) =>
                                                updateNodePosition(id, pos.x, pos.y)
                                            }
                                            onDrag={(id: string, pos: CanvasPosition) =>
                                                updateNodePosition(id, pos.x, pos.y)
                                            }
                                            position={position}
                                            onFinishLinking={handleFinishLinking}
                                        />
                                    )
                                })}
                            </>
                        )}

                        {quickAddPosition && (
                            <QuickAddMenu
                                position={quickAddPosition}
                                onSelect={handleQuickAddSelect as (type: NodeType, parentId?: string) => void}
                                onClose={() => setQuickAddPosition(null)}
                                nodes={nodes}
                            />
                        )}

                        {linkingNode && (
                            <div className='fixed inset-0 bg-black/50 z-40'>
                                <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-[#252525] text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                                    <span>Select a node to link or</span>
                                    <button
                                        onClick={cancelLinking}
                                        className='flex items-center gap-1 text-red-400 hover:text-red-300'
                                    >
                                        <X className='w-4 h-4' />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="fixed bottom-4 right-4 flex items-center gap-2 z-10">
                            <button
                                onClick={handleClearCanvas}
                                className="p-2 bg-[#252525] rounded-lg text-red-400 hover:text-red-300 hover:bg-[#2a2a2a] transition-colors"
                                title="Clear Canvas"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            
                            <button
                                onClick={handleSaveToGist}
                                className="p-2 bg-[#252525] rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-[#2a2a2a] transition-colors"
                                title="Save to Gist"
                            >
                                <Save className="w-5 h-5" />
                            </button>

                            <button
                                onClick={cycleOrientation}
                                className="p-2 bg-[#252525] rounded-lg text-gray-400 hover:text-white transition-colors"
                                title={`Flip ${!orientation ? 'Horizontal' : orientation === 'horizontal' ? 'Vertical' : 'Normal'}`}
                            >
                                {getOrientationIcon()}
                            </button>
                        </div>
                    </div>
                </div>

                {isZenMode && <ZenModeToolbar />}
            </motion.div>

            <AnimatePresence>
                {toastState.show && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                        <Toast 
                            state={toastState.state}
                            message={toastState.message}
                            onDismiss={() => setToastState({ show: false, state: 'initial' })}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
