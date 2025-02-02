import { Dialog, DialogContent } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"

interface DeleteGistDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  gistDescription: string
}

export function DeleteGistDialog({ isOpen, onClose, onConfirm, gistDescription }: DeleteGistDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-white">Delete Configuration</h2>
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete "{gistDescription}"? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 