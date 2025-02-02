import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Download, Upload, Clipboard, Check, AlertCircle } from 'lucide-react'
import { configExport } from '../utils/config-export'
import { useCanvasStore } from '../features/canvas/canvas-slice'

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function ExportImportModal({ isOpen, onClose }: Props) {
    const { config, positions, loadConfig, setPositions } = useCanvasStore()
    const [importText, setImportText] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleExport = () => {
        const exportData = configExport.exportToJson([config], positions)
        const blob = new Blob([exportData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `zsh-config-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopyToClipboard = async () => {
        const exportData = configExport.exportToJson([config], positions)
        await navigator.clipboard.writeText(exportData)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleImport = () => {
        try {
            setError(null)
            const { nodes, positions: importedPositions } = configExport.importFromJson(importText)
            if (nodes.length > 0) {
                loadConfig(nodes[0])
                setPositions(importedPositions)
                onClose()
            } else {
                setError('No valid configuration found in import')
            }
        } catch (e) {
            setError((e as Error).message)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[600px]'>
                <DialogTitle>Export/Import Configuration</DialogTitle>

                <div className='space-y-6'>
                    <div className='space-y-2'>
                        <h3 className='text-sm font-medium text-gray-200'>Export</h3>
                        <div className='flex gap-2'>
                            <Button onClick={handleExport} className='flex items-center gap-2'>
                                <Download className='w-4 h-4' />
                                Download JSON
                            </Button>
                            <Button
                                onClick={handleCopyToClipboard}
                                variant='outline'
                                className='flex items-center gap-2'
                            >
                                {copied ? (
                                    <Check className='w-4 h-4' />
                                ) : (
                                    <Clipboard className='w-4 h-4' />
                                )}
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </Button>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-sm font-medium text-gray-200'>Import</h3>
                        <textarea
                            value={importText}
                            onChange={e => setImportText(e.target.value)}
                            className='w-full h-[200px] bg-[#1E1E1E] text-white rounded-lg p-3 font-mono text-sm'
                            placeholder='Paste your configuration JSON here...'
                        />
                        {error && (
                            <div className='flex items-center gap-2 text-red-400 text-sm'>
                                <AlertCircle className='w-4 h-4' />
                                {error}
                            </div>
                        )}
                        <Button
                            onClick={handleImport}
                            disabled={!importText.trim()}
                            className='flex items-center gap-2'
                        >
                            <Upload className='w-4 h-4' />
                            Import Configuration
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
