import { ChevronDown, Download, Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { generateCommands } from '@/lib/commands'
import { ConfigNode } from '@/types/config'
import { ConnectorSettings } from '@/types/settings'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

interface DownloadButtonProps {
  config: ConfigNode
  basePath: string
  settings: ConnectorSettings
}

export function DownloadButton({ config, basePath, settings }: DownloadButtonProps) {
  const { state, showToast } = useToast();

  const handleDownloadShellScript = () => {
    showToast('loading');
    const commands = generateCommands(config, basePath, settings)
    const blob = new Blob([commands], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'setup-zsh.sh'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyCommands = () => {
    showToast('loading');
    const commands = generateCommands(config, basePath, settings)
    navigator.clipboard.writeText(commands)
  }

  const handleCopyOneCommand = () => {
    showToast('loading');
    const command = `curl -sSL setup-url | bash`  // Replace with actual setup URL
    navigator.clipboard.writeText(command)
  }

  return (
    <div className="relative inline-flex">
      <div className="inline-flex -space-x-px divide-x divide-white/10 rounded-lg shadow-lg shadow-violet-500/20">
        <Button 
          onClick={handleDownloadShellScript}
          className="rounded-none shadow-none first:rounded-s-lg bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] text-white border-0 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)]"
        >
          <Download className="me-2 opacity-80 group-hover:translate-y-0.5 transition-transform" size={16} />
          Download Script
          <span className="-me-1 ms-3 inline-flex h-5 items-center rounded border border-white/20 px-1.5 text-[10px] font-medium text-white/70">
            {config.children?.length || 0} files
          </span>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="rounded-none shadow-none last:rounded-e-lg bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] text-white border-0 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)]"
              size="icon"
            >
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px]">
            <div className="grid gap-0.5">
              <Button 
                variant="ghost" 
                onClick={handleCopyCommands} 
                className="h-8 w-full justify-start text-[13px] text-white/90 hover:text-white hover:bg-white/[0.08] rounded-[6px] px-2"
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy Commands
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleCopyOneCommand} 
                className="h-8 w-full justify-start text-[13px] text-white/90 hover:text-white hover:bg-white/[0.08] rounded-[6px] px-2"
              >
                <Terminal className="mr-2 h-3.5 w-3.5" />
                Copy One-Line Setup
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4">
        <Toast 
          state={state}
          onReset={() => showToast('initial')}
          onSave={() => showToast('loading')}
        />
      </div>
    </div>
  )
}