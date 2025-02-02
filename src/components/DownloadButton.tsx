import { ChevronDown, Download, Copy, Terminal, Upload, Github } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { generateCommands } from '../utils/commands'
import { ConfigNode } from '../types/config'
import { ConnectorSettings } from '../types/settings'
import Toast from './ui/toast'
import { useToast } from '../hooks/useToast'
import { useSettingsStore } from '../features/settings/settings-slice'
import { useAuthStore } from '../features/auth/github-auth'
import { githubGistService } from '../features/persistence/github-gist'
import { useCanvasStore } from '../features/canvas/canvas-slice'

interface Props {
    config: ConfigNode
    settings: ConnectorSettings
}

export function DownloadButton({ config, settings }: Props) {
    const { shellConfig } = useSettingsStore()
    const { state, showToast } = useToast()
    const { isAuthenticated, token, login } = useAuthStore()
    const { positions, orientation, setConfig } = useCanvasStore()

    const getBasePath = () => {
        return `~/${shellConfig.filename}`
    }

    const handleCopyCommands = () => {
        showToast('loading')
        const commands = generateCommands(config, getBasePath(), settings)
        navigator.clipboard.writeText(commands)
    }

    const handleCopyOneCommand = () => {
        showToast('loading')
        const command = `curl -sSL setup-url | bash` // Replace with actual setup URL
        navigator.clipboard.writeText(command)
    }

    const handleLoadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = e => {
            try {
                const content = e.target?.result as string
                const loadedConfig = JSON.parse(content)
                setConfig(loadedConfig)
                showToast('success', 'Configuration loaded successfully')
            } catch (error) {
                showToast('error', 'Failed to load configuration')
            }
        }
        reader.readAsText(file)
    }

    const handleSaveToGithub = async () => {
        if (!isAuthenticated) {
            login()
            return
        }

        try {
            showToast('loading')
            const gistId = await githubGistService.saveConfig(
                {
                    config,
                    positions,
                    orientation
                },
                token!
            )
            showToast('success', 'Saved to GitHub Gists')
        } catch (error) {
            showToast('error', 'Failed to save to GitHub')
        }
    }

    return (
        <div className='relative inline-flex'>
            <div className='inline-flex -space-x-px divide-x divide-white/10 rounded-lg shadow-lg shadow-violet-500/20'>
                <Button
                    onClick={handleSaveToGithub}
                    className='rounded-none shadow-none first:rounded-s-lg bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] text-white border-0 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)]'
                >
                    {isAuthenticated ? (
                        <>
                            <Github className='me-2 opacity-80' size={16} />
                            Save to GitHub
                        </>
                    ) : (
                        <>
                            <Github className='me-2 opacity-80' size={16} />
                            Sign in with GitHub
                        </>
                    )}
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className='rounded-none shadow-none last:rounded-e-lg bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] text-white border-0 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)]'
                            size='icon'
                        >
                            <ChevronDown size={16} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[180px] z-40'>
                        <div className='grid gap-0.5'>
                            <Button
                                variant='ghost'
                                onClick={handleCopyCommands}
                                className='h-8 w-full justify-start text-[13px] text-white/90 hover:text-white hover:bg-white/[0.08] rounded-[6px] px-2'
                            >
                                <Copy className='mr-2 h-3.5 w-3.5' />
                                Copy Commands
                            </Button>
                            <Button
                                variant='ghost'
                                onClick={handleCopyOneCommand}
                                className='h-8 w-full justify-start text-[13px] text-white/90 hover:text-white hover:bg-white/[0.08] rounded-[6px] px-2'
                            >
                                <Terminal className='mr-2 h-3.5 w-3.5' />
                                Copy One-Line Setup
                            </Button>
                            <label className='h-8 w-full justify-start text-[13px] text-white/90 hover:text-white hover:bg-white/[0.08] rounded-[6px] px-2 flex items-center cursor-pointer'>
                                <Upload className='mr-2 h-3.5 w-3.5' />
                                <span>Load Config</span>
                                <input
                                    type='file'
                                    accept='.json'
                                    onChange={handleLoadFile}
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Remove toast from here since it's now handled in App.tsx */}
        </div>
    )
}
