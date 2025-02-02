import { motion } from 'framer-motion'
import { Terminal, Shell, Settings, ArrowRight, GitBranch, Code } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCanvasStore } from '../canvas-slice'
import { ConfigNode } from '@/types/config'

type ShellType = 'zsh' | 'bash' | 'fish'
type ConfigFile = '.zshrc' | '.bashrc' | '.bash_profile' | 'config.fish'
type NodeType = 'zsh' | 'bash' | 'fish' | 'injector' | 'partial'

interface ShellOption {
    type: ShellType
    configFile: ConfigFile
    icon: typeof Terminal
    title: string
    description: string
    features: string[]
    templates: {
        name: string
        description: string
        icon: typeof Code
    }[]
}

const shellOptions: ShellOption[] = [
    {
        type: 'zsh',
        configFile: '.zshrc',
        icon: Shell,
        title: 'ZSH Shell',
        description: 'Modern shell with advanced features and better defaults',
        features: [
            'Advanced auto-completion',
            'Syntax highlighting',
            'Git integration',
            'Plugin support'
        ],
        templates: [
            {
                name: 'Developer Setup',
                description: 'Perfect for web developers with Node.js, Docker, and Git tools',
                icon: Code
            },
            {
                name: 'DevOps Tools',
                description: 'Kubernetes, Docker, and cloud CLI tools pre-configured',
                icon: GitBranch
            }
        ]
    },
    {
        type: 'bash',
        configFile: '.bashrc',
        icon: Terminal,
        title: 'Bash Shell',
        description: 'Classic shell available on most systems',
        features: [],
        templates: []
    },
    {
        type: 'fish',
        configFile: 'config.fish',
        icon: Settings,
        title: 'Fish Shell',
        description: 'User-friendly shell with smart features',
        features: [],
        templates: []
    }
]

interface ShellWizardProps {
    isOpen: boolean
    onClose: () => void
}

const getConfigFileName = (shell: ShellType): string => {
    switch (shell) {
        case 'zsh':
            return '.zshrc'
        case 'bash':
            // Some systems use .bash_profile instead of .bashrc
            return process.platform === 'darwin' ? '.bash_profile' : '.bashrc'
        case 'fish':
            return 'config.fish'
        default:
            return '.zshrc'
    }
}

export function ShellWizard({ isOpen, onClose }: ShellWizardProps) {
    const [step, setStep] = useState<'select-shell' | 'select-template'>('select-shell')
    const [selectedShell, setSelectedShell] = useState<ShellOption | null>(null)
    const [hoveredShell, setHoveredShell] = useState<ShellType | null>(null)
    const setConfig = useCanvasStore(state => state.setConfig)

    const handleShellSelect = (shell: ShellOption) => {
        setSelectedShell(shell)
        setStep('select-template')
    }

    const handleComplete = (template?: string) => {
        if (!selectedShell) return

        const configFileName = getConfigFileName(selectedShell.type)

        const mainNode: ConfigNode = {
            id: configFileName,
            type: selectedShell.type as NodeType,
            title: configFileName,
            content: `#!/bin/${selectedShell.type}
# ${selectedShell.title} Configuration
# Generated with Shell Config Builder

# Create Shell Config directory structure
[ ! -d ~/.${selectedShell.type} ] && mkdir -p ~/.${selectedShell.type}/{core,plugins,scripts}

# Source all configuration files
${selectedShell.type === 'zsh' ? 
    '# Source ZSH configuration files\nfor config_file (~/.zsh/**/*.sh) {\n    [ -r "$config_file" ] && source "$config_file"\n}' :
    selectedShell.type === 'bash' ?
    '# Source Bash configuration files\nfor config_file in ~/.bash/**/*.sh; do\n    [ -r "$config_file" ] && source "$config_file"\ndone' :
    '# Fish shell uses conf.d directory by default\nfor conf in ~/.config/fish/conf.d/*.fish\n    source $conf\nend'}`,
            level: 0,
            children: [],
            connections: []
        }

        setConfig([mainNode])
        onClose()
    }

    useEffect(() => {
        if (isOpen) {
            setStep('select-shell')
            setSelectedShell(null)
        }
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
            <div className="bg-[#1E1E1E] rounded-lg border border-zinc-800 p-8 shadow-2xl">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">
                            Choose Your Shell
                        </h2>
                        <p className="text-zinc-400">
                            Select your preferred shell to get started with a configuration optimized for your needs.
                        </p>
                    </div>

                    {step === 'select-shell' ? (
                        <div className="grid gap-4">
                            {shellOptions.map((shell) => (
                                <motion.button
                                    key={shell.type}
                                    onClick={() => handleShellSelect(shell)}
                                    className="group relative"
                                    onHoverStart={() => setHoveredShell(shell.type)}
                                    onHoverEnd={() => setHoveredShell(null)}
                                    whileHover={{ x: 8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="flex items-start gap-6 p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 text-left hover:bg-zinc-900/70 transition-all duration-200 group-hover:border-indigo-500/50">
                                        <div className="p-3 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-800">
                                            <shell.icon className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-white/90 mb-2 flex items-center gap-2">
                                                {shell.title}
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                            </h3>
                                            <p className="text-sm text-zinc-400 mb-4">
                                                {shell.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {shell.features.map((feature, i) => (
                                                    <motion.div 
                                                        key={feature}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-center gap-2 text-sm text-zinc-500"
                                                    >
                                                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                                        {feature}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                                <button 
                                    onClick={() => setStep('select-shell')}
                                    className="text-zinc-400 hover:text-white flex items-center gap-2"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back to shells
                                </button>
                                <div className="h-px flex-1 bg-zinc-800" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <motion.button
                                    onClick={() => handleComplete()}
                                    className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 text-left hover:bg-zinc-900/70 transition-all duration-200 hover:border-indigo-500/50"
                                    whileHover={{ y: -4 }}
                                >
                                    <h3 className="text-lg font-medium text-white/90 mb-2">
                                        Start Fresh
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        Begin with a clean configuration and build from scratch
                                    </p>
                                </motion.button>

                                {selectedShell?.templates.map((template, i) => (
                                    <motion.button
                                        key={template.name}
                                        onClick={() => handleComplete(template.name)}
                                        className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 text-left hover:bg-zinc-900/70 transition-all duration-200 hover:border-indigo-500/50"
                                        whileHover={{ y: -4 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <h3 className="text-lg font-medium text-white/90 mb-2 flex items-center gap-2">
                                            {template.name}
                                            <template.icon className="w-4 h-4 text-indigo-400" />
                                        </h3>
                                        <p className="text-sm text-zinc-400">
                                            {template.description}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 