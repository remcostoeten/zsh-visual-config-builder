import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Terminal, GitBranch, Code, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { stagger } from 'framer-motion'

const treeData = [
    {
        name: '.zshrc',
        type: 'main',
        description: 'Main configuration entry point',
        children: [
            {
                name: 'core/',
                type: 'folder',
                description: 'Essential shell configurations',
                children: [
                    {
                        name: 'core_injector.sh',
                        type: 'injector',
                        description: 'Core shell settings and options',
                        children: [
                            { name: 'env-core.sh', type: 'partial', description: 'Environment variables' },
                            { name: 'options-core.sh', type: 'partial', description: 'ZSH options' }
                        ]
                    },
                    {
                        name: 'alias_injector.sh',
                        type: 'injector',
                        description: 'Shell aliases manager',
                        children: [
                            { name: 'git-aliases.sh', type: 'partial', description: 'Git commands' },
                            { name: 'nav-aliases.sh', type: 'partial', description: 'Navigation shortcuts' },
                            { name: 'docker-aliases.sh', type: 'partial', description: 'Docker commands' },
                            { name: 'system-aliases.sh', type: 'partial', description: 'System utilities' }
                        ]
                    }
                ]
            },
            {
                name: 'plugins/',
                type: 'folder',
                description: 'External tools and plugins',
                children: [
                    {
                        name: 'package_injector.sh',
                        type: 'injector',
                        description: 'Package manager configurations',
                        children: [
                            { name: 'brew-packages.sh', type: 'partial', description: 'Homebrew setup' },
                            { name: 'nvm-packages.sh', type: 'partial', description: 'Node version manager' }
                        ]
                    },
                    {
                        name: 'tools_injector.sh',
                        type: 'injector',
                        description: 'Development tools',
                        children: [
                            { name: 'autojump-tools.sh', type: 'partial', description: 'Directory jumping' },
                            { name: 'fzf-tools.sh', type: 'partial', description: 'Fuzzy finder' }
                        ]
                    }
                ]
            },
            {
                name: 'scripts/',
                type: 'folder',
                description: 'Custom shell scripts',
                children: [
                    {
                        name: 'utils_injector.sh',
                        type: 'injector',
                        description: 'Utility scripts',
                        children: [
                            { name: 'docker-utils.sh', type: 'partial', description: 'Docker utilities' },
                            { name: 'port-utils.sh', type: 'partial', description: 'Port management' },
                            { name: 'search-utils.sh', type: 'partial', description: 'Search utilities' }
                        ]
                    },
                    {
                        name: 'dev_injector.sh',
                        type: 'injector',
                        description: 'Development helpers',
                        children: [
                            { name: 'db-dev.sh', type: 'partial', description: 'Database utilities' },
                            { name: 'git-dev.sh', type: 'partial', description: 'Git automation' }
                        ]
                    }
                ]
            }
        ]
    }
]

export function AsciiTree() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['core/', 'tools/']))

    const toggleFolder = (path: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent double triggers
        setExpandedFolders(prev => {
            const next = new Set(prev)
            if (next.has(path)) {
                next.delete(path)
            } else {
                next.add(path)
            }
            return next
        })
    }

    const renderNode = (node: any, depth: number = 0, isLast: boolean = true, path: string[] = [], index: number = 0) => {
        const currentPath = [...path, node.name].join('/')
        const isHovered = hoveredNode === currentPath
        const isFolder = node.type === 'folder'
        const isExpanded = expandedFolders.has(node.name)
        const prefix = depth === 0 ? '' : isLast ? '└── ' : '├── '
        const indent = depth === 0 ? '' : ' '.repeat(depth * 4)

        return (
            <motion.div 
                key={currentPath}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                    delay: depth * 0.1 + index * 0.05,
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
            >
                <motion.div
                    className={`flex items-center group ${
                        isHovered ? 'bg-white/[0.02]' : ''
                    } rounded px-2 -mx-2 ${isFolder ? 'cursor-pointer' : ''}`}
                    onMouseEnter={() => setHoveredNode(currentPath)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={isFolder ? (e) => toggleFolder(node.name, e) : undefined}
                    initial={false}
                    animate={{ 
                        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0)'
                    }}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.pre
                        className="font-mono text-sm transition-colors py-1 flex items-center flex-1"
                        initial={false}
                        animate={{
                            color: isHovered ? '#fff' : '#71717a'
                        }}
                    >
                        <span className="text-zinc-600">{indent}</span>
                        <span className="text-zinc-500">{prefix}</span>
                        {isFolder && (
                            <motion.div
                                className="inline-flex items-center mr-1"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isExpanded ? (
                                    <FolderOpen className="w-3.5 h-3.5 text-yellow-400" />
                                ) : (
                                    <Folder className="w-3.5 h-3.5 text-yellow-400" />
                                )}
                            </motion.div>
                        )}
                        <span className={`${getTypeColor(node.type)} flex items-center gap-2`}>
                            {getIcon(node.type)}
                            {node.name}
                        </span>
                    </motion.pre>
                    {node.description && (
                        <motion.span 
                            className="ml-4 text-xs text-zinc-600 select-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {node.description}
                        </motion.span>
                    )}
                </motion.div>
                <AnimatePresence mode="wait">
                    {(!isFolder || isExpanded) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                                height: 'auto', 
                                opacity: 1,
                                transition: {
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.2, delay: 0.1 }
                                }
                            }}
                            exit={{ 
                                height: 0, 
                                opacity: 0,
                                transition: {
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.2 }
                                }
                            }}
                            style={{ overflow: 'hidden' }}
                        >
                            {node.children?.map((child: any, index: number) =>
                                renderNode(
                                    child,
                                    depth + 1,
                                    index === node.children.length - 1,
                                    [...path, node.name],
                                    index
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'main':
                return <Terminal className="w-3 h-3 inline mr-2" />
            case 'injector':
                return <GitBranch className="w-3 h-3 inline mr-2" />
            case 'partial':
                return <Code className="w-3 h-3 inline mr-2" />
            default:
                return null
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'main':
                return 'text-indigo-400'
            case 'injector':
                return 'text-emerald-400'
            case 'partial':
                return 'text-purple-400'
            case 'folder':
                return 'text-yellow-400'
            default:
                return 'text-zinc-400'
        }
    }

    return (
        <motion.div
            className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            <motion.div 
                className="flex items-center gap-4 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-zinc-400 text-sm">Example Structure</span>
                <div className="flex-1 h-px bg-zinc-800" />
            </motion.div>
            <div 
                className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar"
                style={{
                    scrollbarGutter: 'stable',
                }}
            >
                {treeData.map((node, index) => renderNode(node, 0, true, [], index))}
            </div>
            <motion.div 
                className="mt-6 grid grid-cols-4 gap-4 text-xs border-t border-zinc-800 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                    delay: 0.4,
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
            >
                <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="text-zinc-400">Main Config</span>
                </motion.div>
                <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-zinc-400">Folders</span>
                </motion.div>
                <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-zinc-400">Injectors</span>
                </motion.div>
                <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-zinc-400">Partials</span>
                </motion.div>
            </motion.div>
        </motion.div>
    )
} 