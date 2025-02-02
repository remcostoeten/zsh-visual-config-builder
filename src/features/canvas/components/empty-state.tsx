import React from 'react'
import { motion } from 'framer-motion'
import { Terminal, ArrowRight, GitBranch, Code, Plus, FolderTree } from 'lucide-react'
import { useCanvasStore } from '../canvas-slice'
import { AsciiTree } from '../../../components/ascii-tree'
import { Button } from '@/shared/components/ui/button'

const exampleStructure = {
    name: '.zshrc',
    type: 'main',
    description: 'Main configuration file',
    children: [
        {
            name: 'core/',
            type: 'folder',
            description: 'Essential configurations',
            children: [
                {
                    name: 'aliases_injector.sh',
                    type: 'injector',
                    description: 'Common shell aliases',
                    children: [
                        { name: 'git-aliases.sh', type: 'partial', description: 'Git shortcuts' },
                        { name: 'system-aliases.sh', type: 'partial', description: 'System commands' }
                    ]
                }
            ]
        },
        {
            name: 'tools/',
            type: 'folder',
            description: 'Development tools',
            children: [
                {
                    name: 'dev_injector.sh',
                    type: 'injector',
                    description: 'Development environment',
                    children: [
                        { name: 'node-setup.sh', type: 'partial', description: 'Node.js configuration' },
                        { name: 'docker-setup.sh', type: 'partial', description: 'Docker utilities' }
                    ]
                }
            ]
        }
    ]
}

interface Props {
    onStartClick: () => void
}

export function EmptyState({ onStartClick }: Props) {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="max-w-4xl w-full p-8">
                <motion.div 
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Shell Config Builder
                        </h1>
                        <p className="text-zinc-400 max-w-lg">
                            Create a modular, maintainable shell configuration with a visual editor. 
                            Split your monolithic config into focused, reusable modules.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white">
                                <FolderTree className="w-5 h-5 text-indigo-400" />
                                <h2 className="font-medium">Example Structure</h2>
                            </div>
                            
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <AsciiTree tree={exampleStructure} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span className="text-sm text-zinc-400">Main Config</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="text-sm text-zinc-400">Folders</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        <span className="text-sm text-zinc-400">Injectors</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                        <span className="text-sm text-zinc-400">Partials</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-emerald-400" />
                                    <h3 className="text-white font-medium">Getting Started</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-zinc-400">
                                    <li>• Choose your preferred shell (ZSH, Bash, Fish)</li>
                                    <li>• Start with a template or empty config</li>
                                    <li>• Add modules using the visual editor</li>
                                    <li>• Export your configuration when ready</li>
                                </ul>
                            </div>

                            <Button 
                                onClick={onStartClick}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                                Create New Configuration
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
} 