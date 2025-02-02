import { useEffect, useState } from "react"
import { useAuthStore } from "../../auth/github-auth"
import { githubGistService } from "../github-gist"
import { Button } from "@/shared/components/ui/button"
import { FileJson, Clock, Download, Trash2 } from "lucide-react"
import { useCanvasStore } from "../../canvas/canvas-slice"
import { formatDistanceToNow } from "date-fns"
import { DeleteGistDialog } from './delete-gist-dialog'

export function GistList() {
  const [gists, setGists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gistToDelete, setGistToDelete] = useState<any | null>(null)
  const { token } = useAuthStore()
  const { setConfig, setPositions } = useCanvasStore()

  useEffect(() => {
    if (token) {
      loadGists()
    }
  }, [token])

  const loadGists = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const gistList = await githubGistService.listGists(token!)
      setGists(gistList)
    } catch (err) {
      setError('Failed to load configurations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadConfig = async (gistId: string) => {
    const data = await githubGistService.loadConfig(gistId, token!)
    setConfig([data.config])
    setPositions(data.positions)
  }

  if (isLoading) {
    return <div className="p-4 text-center text-zinc-400">Loading configurations...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        {error}
        <Button variant="link" onClick={loadGists}>Retry</Button>
      </div>
    )
  }

  if (gists.length === 0) {
    return <div className="p-4 text-center text-zinc-400">No saved configurations found</div>
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Saved Configurations</h2>
        <div className="space-y-2">
          {gists.map((gist) => (
            <div
              key={gist.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <FileJson className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {gist.description || "Untitled Configuration"}
                  </h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(gist.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLoadConfig(gist.id)}
                  className="text-zinc-400 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Load
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(gist)}
                  className="text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteGistDialog
        isOpen={!!gistToDelete}
        onClose={() => setGistToDelete(null)}
        onConfirm={handleConfirmDelete}
        gistDescription={gistToDelete?.description || "Untitled Configuration"}
      />
    </>
  )
} 