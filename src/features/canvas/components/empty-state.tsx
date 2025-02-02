import React from 'react'
import { motion } from 'framer-motion'
import { Terminal, ArrowRight, GitBranch, Code, Plus, FolderTree } from 'lucide-react'
import { useCanvasStore } from '../canvas-slice'
import { AsciiTree } from '../../../components/ascii-tree'
import { ShellWizard } from './shell-wizard'

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

export function EmptyState() {
    return (
        <div className="w-full h-full overflow-auto">
            <div className="max-w-6xl mx-auto p-8">
                <div className="grid grid-cols-2 gap-12">
                    {/* Left side: Introduction and visualization */}
                    <motion.div 
                        className="space-y-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white">
                                Shell Config Builder
                            </h1>
                            <p className="text-lg text-zinc-400">
                                Create a modular, maintainable shell configuration with a visual editor.
                                Split your monolithic config into focused, reusable modules.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FolderTree className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-lg font-medium text-white">Example Structure</h2>
                            </div>
                            
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <AsciiTree tree={exampleStructure} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span>Modular Organization</span>
                                    </div>
                                    <p className="text-sm text-zinc-500 pl-4">
                                        Split your config into logical modules
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span>Visual Editor</span>
                                    </div>
                                    <p className="text-sm text-zinc-500 pl-4">
                                        Drag & drop interface with live preview
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side: Shell Wizard */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <ShellWizard onClose={() => {}} />
                    </motion.div>
                </div>
            </div>
        </div>
    )
} 