import { Button } from "@/shared/components/ui/button"
import { Download } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/ui/dialog"
import { GistList } from "@/features/persistence/components/gist-list"

export function LoadConfigButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Load Configuration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-semibold mb-4">Load Configuration</h2>
        <GistList />
      </DialogContent>
    </Dialog>
  )
} 