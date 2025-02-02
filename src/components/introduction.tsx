import React, { useState } from 'react'
import { SplitSquareHorizontal, FileCode, GitFork, Settings2, BookOpen } from 'lucide-react'
import { devTemplate, dockerTemplate } from '../config/templates'
import { ConfigNode } from '../types/config'
import { useToast } from '../hooks/use-toast'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface Props {
    onTemplateSelect: (template: ConfigNode) => void
    onSaveConfig: () => void
    onLoadConfig: (config: ConfigNode) => void
    currentConfig: ConfigNode
}

export function Introduction({
    onTemplateSelect,
    onSaveConfig,
    onLoadConfig,
    currentConfig
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const { showToast } = useToast()

    const handleTemplateSelect = (template: ConfigNode) => {
        if (currentConfig.children && currentConfig.children.length > 0) {
            if (
                window.confirm(
                    'This will overwrite your current configuration. Would you like to save it first?'
                )
            ) {
                onSaveConfig()
            }
        }
        onTemplateSelect(template)
        showToast({ type: 'success', message: 'Template loaded successfully' })
    }

    return (
        <>
            <Button
                variant='ghost'
                onClick={() => setIsOpen(true)}
                className='text-gray-400 hover:text-white flex items-center gap-2'
            >
                <BookOpen className='w-4 h-4' />
                About
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='sm:max-w-[600px]'>
                    <DialogTitle>About Shell Config Builder</DialogTitle>

                    <div className='space-y-4'>
                        <p className='text-sm text-gray-400'>
                            A visual tool for creating and managing modular Shell Configurations.
                        </p>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-[#252525] p-3 rounded-lg border border-[#333]'>
                                <div className='text-indigo-400 mb-2'>
                                    <SplitSquareHorizontal className='w-4 h-4' />
                                </div>
                                <h3 className='text-white text-sm font-medium mb-1'>
                                    Split Config
                                </h3>
                                <p className='text-xs text-gray-400'>Organize ZSH into modules</p>
                            </div>

                            <div className='bg-[#252525] p-3 rounded-lg border border-[#333]'>
                                <div className='text-indigo-400 mb-2'>
                                    <FileCode className='w-4 h-4' />
                                </div>
                                <h3 className='text-white text-sm font-medium mb-1'>
                                    Visual Editor
                                </h3>
                                <p className='text-xs text-gray-400'>
                                    Syntax highlighting & validation
                                </p>
                            </div>

                            <div className='bg-[#252525] p-3 rounded-lg border border-[#333]'>
                                <div className='text-indigo-400 mb-2'>
                                    <GitFork className='w-4 h-4' />
                                </div>
                                <h3 className='text-white text-sm font-medium mb-1'>
                                    Dependencies
                                </h3>
                                <p className='text-xs text-gray-400'>Visualize config structure</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 mt-6'>
                            <button
                                onClick={() => {
                                    handleTemplateSelect(devTemplate)
                                    setIsOpen(false)
                                }}
                                className='bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg p-3 text-left transition-colors'
                            >
                                <h3 className='text-indigo-400 font-medium'>Developer Template</h3>
                                <p className='text-sm text-gray-400'>
                                    Git, Docker, Node.js configuration
                                </p>
                            </button>

                            <button
                                onClick={() => {
                                    handleTemplateSelect(dockerTemplate)
                                    setIsOpen(false)
                                }}
                                className='bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg p-3 text-left transition-colors'
                            >
                                <h3 className='text-emerald-400 font-medium'>Docker Template</h3>
                                <p className='text-sm text-gray-400'>
                                    Server management & monitoring
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end gap-3'>
                        <Button variant='ghost' onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
