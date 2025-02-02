import { Button } from "@/shared/components/ui/button"
import { useCanvasStore } from "../canvas-slice"
import { Download, Upload, Plus, Save } from "lucide-react"
import { useAuthStore } from "@/features/auth/github-auth"
import { githubGistService } from "@/features/persistence/github-gist"
import { toast } from "@/shared/components/ui/toast/toast-service"

export function CanvasActions() {
    const { config, positions } = useCanvasStore()
    const { token, isAuthenticated } = useAuthStore()

    const handleSave = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to save configurations")
            return
        }

        try {
            await githubGistService.saveConfig({ config, positions }, token!)
            toast.success("Configuration saved successfully")
        } catch (error) {
            toast.error("Failed to save configuration")
        }
    }

    const handleExport = () => {
        const data = JSON.stringify({ config, positions }, null, 2)
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "shell-config.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "application/json"
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string)
                    useCanvasStore.setState(data)
                    toast.success("Configuration imported successfully")
                } catch (error) {
                    toast.error("Failed to import configuration")
                }
            }
            reader.readAsText(file)
        }
        input.click()
    }

    const handleAddNode = () => {
        const store = useCanvasStore.getState()
        const position = { x: 200, y: 200 }
        store.addNode('injector', position)
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddNode}>
                <Plus className="w-4 h-4 mr-2" />
                Add Node
            </Button>
        </div>
    )
} 