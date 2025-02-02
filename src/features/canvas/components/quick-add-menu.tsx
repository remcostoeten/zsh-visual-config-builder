import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FileCode, GitFork, Plus } from 'lucide-react'
import { useCanvasStore } from '../canvas-slice'
import { Position, NodeType, ConfigNode } from '@/types/config'
import { Dialog, DialogContent } from '@/shared/components/ui'
import { DialogTitle } from '@radix-ui/react-dialog'

interface QuickAddMenuProps {
    position: Position
    onSelect: (type: NodeType, parentId?: string) => void
    onClose: () => void
    nodes: ConfigNode[]
}

export function QuickAddMenu({ position, onSelect, onClose, nodes }: QuickAddMenuProps) {
    const [showInjectorSelect, setShowInjectorSelect] = useState(false)
    const config = useCanvasStore(state => state.config)
    const menuRef = useRef<HTMLDivElement>(null)
    
    // Use a fixed position relative to the viewport
    const menuPosition = useMemo(() => {
        if (!position) return { left: 0, top: 0 }
        
        return {
            left: position.x,
            top: position.y
        }
    }, [position])

    const findInjectors = (node: ConfigNode): ConfigNode[] => {
        let injectors: ConfigNode[] = []
        if (node.type === 'injector') {
            injectors.push(node)
        }
        if (node.children) {
            node.children.forEach(child => {
                injectors = [...injectors, ...findInjectors(child)]
            })
        }
        return injectors
    }

    const existingInjectors = findInjectors(config)

    const getInjectorNodes = () => nodes.filter(node => node.type === 'injector')

    const handleSelect = (type: NodeType) => {
        if (type === 'partial') {
            setShowInjectorSelect(true)
        } else {
            onSelect(type)
        }
    }
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    return (
        <>
            <div
                ref={menuRef}
                className="absolute bg-[#1E1E1E] rounded-lg border border-zinc-800 shadow-2xl p-1.5 w-52 animate-in fade-in zoom-in-95 duration-100 z-50"
                style={{
                    left: menuPosition.left,
                    top: menuPosition.top,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <button
                    onClick={() => handleSelect('injector')}
                    className="flex items-center gap-2.5 w-full p-2.5 text-left text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-md transition-colors group"
                >
                    <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 group-hover:text-violet-300 transition-colors">
                        <GitFork className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">Add Injector</span>
                        <span className="text-xs text-zinc-500">Source configuration files</span>
                    </div>
                </button>
                <button
                    onClick={() => handleSelect('partial')}
                    className="flex items-center gap-2.5 w-full p-2.5 text-left text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-md transition-colors group mt-1"
                >
                    <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                        <FileCode className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">Add Partial</span>
                        <span className="text-xs text-zinc-500">Shell configuration module</span>
                    </div>
                </button>
            </div>

            <Dialog open={showInjectorSelect} onOpenChange={setShowInjectorSelect}>
                <DialogContent className="sm:max-w-[400px] bg-[#1E1E1E] border-zinc-800 p-0">
                    <div className="px-4 pt-4 pb-2">
                        <DialogTitle>Select Parent Injector</DialogTitle>
                    </div>
                    <div className="px-4 pb-4">
                        <p className="text-sm text-zinc-400 mb-3">
                            Choose an injector to attach this partial configuration to
                        </p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {getInjectorNodes().map(injector => (
                                <button
                                    key={injector.id}
                                    onClick={() => {
                                        onSelect('partial', injector.id)
                                        setShowInjectorSelect(false)
                                    }}
                                    className="w-full p-3 text-left bg-zinc-900/50 hover:bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GitFork className="w-4 h-4 text-violet-400" />
                                            <span className="font-medium text-zinc-200">{injector.title}</span>
                                        </div>
                                        <Plus className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                                    </div>
                                </button>
                            ))}
                            {getInjectorNodes().length === 0 && (
                                <div className="text-center py-8 text-zinc-500">
                                    <p className="text-sm mt-1">Create an injector first</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default QuickAddMenu
