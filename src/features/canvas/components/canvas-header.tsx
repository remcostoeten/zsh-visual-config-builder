import { LoadConfigButton } from "@/components/load-config-button"
import { Button } from "@/shared/components/ui/button"
import { Save } from "lucide-react"
import { useCanvasStore } from "../canvas-slice"
import { useToast } from "@/shared/hooks/use-toast"

export function CanvasHeader() {
  const { saveConfig, hasUnsavedChanges } = useCanvasStore()
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      await saveConfig()
      toast({
        title: "Success",
        description: "Configuration saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
        <LoadConfigButton />
      </div>
    </div>
  )
} 