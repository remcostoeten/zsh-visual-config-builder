import React, { useEffect, useState } from 'react'
import { useCanvasStore } from '../canvas-slice'
import { DraggableNode } from './draggable-node'
import { AnimatedConnector } from './animated-connector'
import { X, FlipHorizontal2, FlipVertical2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../settings/settings-slice'
import { QuickAddMenu } from './quick-add-menu'
import { ZenModeToolbar } from '../../../components/ZenModeToolbar'
import { ConfigNode,  Position as CanvasPosition } from '../../../types/config'
import { EmptyState } from './empty-state'
import { ShellWizard } from './shell-wizard'
import { Dialog, DialogContent } from '../../../components/ui/dialog'

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
        cycleOrientation
    } = useCanvasStore()

    const { settings } = useSettingsStore()
    const canvasRef = React.useRef<HTMLDivElement>(null)
    const [, setShowHint] = React.useState(true)
    const [showWizard, setShowWizard] = useState(false)

    const nodes = useCanvasStore(state => state.nodes)
    const hasAnyNodes = nodes.length > 0

    useEffect(() => {
        if (!hasAnyNodes) {
            setShowWizard(true)
        }
    }, [hasAnyNodes])

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

    const handleQuickAddSelect = (type: 'injector' | 'partial') => {
        if (!quickAddPosition) return
        
        addNode(type, quickAddPosition)
        setQuickAddPosition(null) // Clear the position after adding node
    }

    return (
        <>
            <motion.div 
                className="flex-1 flex flex-col relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div
                    ref={canvasRef}
                    className={`absolute inset-0 bg-[#1E1E1E] rounded-md overflow-auto custom-scrollbar border border-[#333] m-2 transition-transform duration-500 ${getOrientationStyles()}`}
                    onClick={handleCanvasClick}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                >
                    {!hasAnyNodes ? (
                        <EmptyState />
                    ) : (
                        <>
                            {renderConnectors(config)}

                            {Object.entries(positions).map(([id, position]: [string, CanvasPosition]) => {
                                const findNode = (node: ConfigNode): ConfigNode | null => {
                                    if (node.id === id) return node
                                    if (node.children) {
                                        for (const child of node.children) {
                                            const found = findNode(child)
                                            if (found) return found
                                        }
                                    }
                                    return null
                                }

                                const node = findNode(config)
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
                                    />
                                )
                            })}

                            {quickAddPosition && (
                                <QuickAddMenu
                                    position={quickAddPosition}
                                    onSelect={handleQuickAddSelect}
                                    onClose={() => setQuickAddPosition(null)}
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

                            <button
                                onClick={cycleOrientation}
                                className='absolute bottom-4 right-4 p-2 bg-[#252525] rounded-lg text-gray-400 hover:text-white transition-colors z-10'
                                title={`Flip ${orientation === 'normal' ? 'Horizontal' : orientation === 'horizontal' ? 'Vertical' : 'Normal'}`}
                            >
                                {getOrientationIcon()}
                            </button>
                        </>
                    )}
                </div>

                {isZenMode && <ZenModeToolbar />}
            </motion.div>

            {showWizard && (
                <Dialog open={showWizard} onOpenChange={setShowWizard}>
                    <DialogContent>
                        <ShellWizard onClose={() => setShowWizard(false)} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
