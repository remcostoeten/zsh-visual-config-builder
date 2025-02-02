import { ReactNode } from 'react'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'

interface AlertProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    description: string | ReactNode
    confirmText?: string
    cancelText?: string
}

export function Alert({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    description,
    confirmText = 'OK',
    cancelText = 'Cancel'
}: AlertProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-white">{title}</h2>
                        <p className="text-sm text-gray-400">{description}</p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 