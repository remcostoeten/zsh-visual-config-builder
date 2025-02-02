import { Button } from "@/shared/components/ui/button"
import { Save, Github, Download } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { useAuthStore } from "../../auth/github-auth"
import { githubGistService } from "../github-gist"
import { useToast } from "@/shared/hooks/use-toast"
import { generateShellScript } from "../shell-script-generator"
import { ConfigNode } from "@/types/config"
import { useCanvasStore } from "../../canvas/canvas-slice"

interface Props {
  config: ConfigNode
}

export function SaveConfigButton({ config }: Props) {
  const { isAuthenticated, token, login } = useAuthStore()
  const { positions, orientation } = useCanvasStore()
  const { toast } = useToast()

  const handleSaveToGist = async () => {
    if (!config || (Array.isArray(config.children) && config.children.length === 0)) {
      toast({ 
        title: "Empty Configuration", 
        description: "Please add some configuration before saving.",
        variant: "error" 
      })
      return
    }

    if (!isAuthenticated || !token) {
      toast({ 
        title: "Authentication Required", 
        description: "Please sign in with GitHub to save your configuration.",
        variant: "error" 
      })
      login()
      return
    }

    try {
      toast({ title: "Saving configuration...", variant: "loading" })
      await githubGistService.saveConfig(
        {
          config,
          positions,
          orientation
        },
        token
      )
      toast({ title: "Configuration saved to GitHub Gists", variant: "success" })
    } catch (error) {
      toast({ 
        title: "Failed to save configuration", 
        description: "Please ensure you're signed in and try again.",
        variant: "error" 
      })
    }
  }

  const handleSaveLocal = () => {
    try {
      const script = generateShellScript(config)
      const blob = new Blob([script], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'setup.sh'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: "Shell script downloaded successfully", variant: "success" })
    } catch (error) {
      toast({ title: "Failed to generate shell script", variant: "error" })
    }
  }

  const isConfigEmpty = !config || (Array.isArray(config.children) && config.children.length === 0)

  return (
    <div className="relative inline-flex">
      <Button
        onClick={handleSaveToGist}
        disabled={isConfigEmpty}
        className="rounded-l-lg rounded-r-none bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAuthenticated ? (
          <>
            <Github className="mr-2 h-4 w-4 opacity-80" />
            Save to GitHub
          </>
        ) : (
          <>
            <Github className="mr-2 h-4 w-4 opacity-80" />
            Sign in with GitHub
          </>
        )}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="rounded-l-none rounded-r-lg bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] px-2"
          >
            <Save className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSaveLocal}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Script
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
} 