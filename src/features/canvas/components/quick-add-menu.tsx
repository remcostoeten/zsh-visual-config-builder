import React, { useRef, useMemo, useEffect } from 'react'
import { FileCode, GitFork, Copy } from 'lucide-react'
import { useCanvasStore } from '../canvas-slice'
import { Position } from '../../../types/config'
import { NodeType, ConfigNode } from '../../../types/config'

interface Props {
    position: Position
    onSelect: (type: NodeType, template?: ConfigNode) => void
    onClose: () => void
}

export function QuickAddMenu({ position, onSelect, onClose }: Props) {
    const [showTemplates, setShowTemplates] = React.useState<'injector' | 'partial' | null>(null)
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
        <div
            ref={menuRef}
            className='absolute bg-[#252525] rounded-lg border border-[#333] shadow-xl p-2 w-48 z-50'
            style={{
                left: `${menuPosition.left}px`,
                top: `${menuPosition.top}px`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {!showTemplates ? (
                <>
                    <button
                        onClick={() => {
                            onSelect('injector')
                            onClose()
                        }}
                        className='flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors'
                    >
                        <GitFork className='w-4 h-4' />
                        Add Injector
                    </button>
                    <button
                        onClick={() => {
                            onSelect('partial')
                            onClose()
                        }}
                        className='flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors'
                    >
                        <FileCode className='w-4 h-4' />
                        Add Partial
                    </button>
                    <div className='h-px bg-[#333] my-1' />
                    <button
                        onClick={() => setShowTemplates('injector')}
                        className='flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors'
                    >
                        <GitFork className='w-4 h-4' />
                        From Injector Template
                    </button>
                    <button
                        onClick={() => setShowTemplates('partial')}
                        className='flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors'
                    >
                        <FileCode className='w-4 h-4' />
                        From Partial Template
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={() => setShowTemplates(null)}
                        className='flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors mb-1'
                    >
                        ← Back
                    </button>
                    <div className='h-px bg-[#333] mb-1' />
                    {existingInjectors.map(injector => (
                        <button
                            key={injector.id}
                            onClick={() => {
                                onSelect(showTemplates, injector)
                                setShowTemplates(null)
                            }}
                            className='flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors'
                        >
                            <Copy className='w-4 h-4' />
                            {injector.title}
                        </button>
                    ))}
                </>
            )}
        </div>
    )
}

export default QuickAddMenu
