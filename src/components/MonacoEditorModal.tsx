import React, { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { validateShellScript } from '../utils/shell-validation'
import ShellHelpers from './ShellHelpers'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    content: string
    onSave: (content: string) => void
    isMainNode?: boolean
}

export default function MonacoEditorModal({
    isOpen,
    onClose,
    title,
    content,
    onSave,
    isMainNode
}: Props) {
    const [editorContent, setEditorContent] = React.useState(content)
    const [validation, setValidation] = React.useState({ isValid: true })
    const dialogContentRef = useRef<HTMLDivElement>(null)

    // Reset content when modal opens
    useEffect(() => {
        if (isOpen) {
            setEditorContent(content)
        }
    }, [isOpen, content])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    const handleInteractOutside = (e: React.MouseEvent) => {
        // Check if the click is actually outside the modal content
        if (dialogContentRef.current && !dialogContentRef.current.contains(e.target as Node)) {
            onClose()
        }
    }

    const handleContentChange = (value: string = '') => {
        setEditorContent(value)
        setValidation(validateShellScript(value))
    }

    const handleInsertSnippet = (code: string) => {
        setEditorContent(prev => prev + '\n' + code)
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                ref={dialogContentRef}
                className='sm:max-w-[1200px] h-[800px]'
                onEscapeKeyDown={onClose}
                onPointerDownOutside={handleInteractOutside}
            >
                <DialogTitle>{title}</DialogTitle>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        {!validation.isValid && (
                            <p className='text-sm text-red-400 mt-1'>{validation.error}</p>
                        )}
                    </div>
                    <div className='space-x-2'>
                        <Button
                            onClick={() => onSave(editorContent)}
                            className='px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700'
                            disabled={!validation.isValid}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={onClose}
                            className='px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700'
                        >
                            Close
                        </Button>
                    </div>
                </div>

                <div className='flex gap-4 h-[calc(100%-60px)]'>
                    <div className={isMainNode ? 'w-full' : 'flex-1'}>
                        <Editor
                            height='100%'
                            value={editorContent}
                            language='shell'
                            theme='vs-dark'
                            onChange={handleContentChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                insertSpaces: true,
                                autoIndent: 'full',
                                formatOnPaste: true
                            }}
                        />
                    </div>
                    {!isMainNode && (
                        <div className='w-[300px]'>
                            <ShellHelpers onInsertSnippet={handleInsertSnippet} />
                        </div>
                    )}
                </div>

                {isMainNode && (
                    <div className='mt-4 p-4 bg-[#1E1E1E] rounded-lg'>
                        <h3 className='text-sm font-medium text-white/80 mb-2'>Main Configuration</h3>
                        <p className='text-xs text-white/60 mb-4'>
                            The .zshrc file should only contain:
                            <ul className='list-disc list-inside mt-2 space-y-1'>
                                <li>Source commands for modules</li>
                                <li>Directory structure setup</li>
                                <li>Comments for documentation</li>
                            </ul>
                        </p>
                        <div className='space-y-2'>
                            <code className='block text-xs bg-black/20 p-2 rounded text-white/70'>
                                # Create ZSH config directories
                                [ ! -d ~/.zsh ] && mkdir -p ~/.zsh/{core,git,node}
                                
                                # Source configuration files
                                source ~/.zsh/core/aliases.sh
                                source ~/.zsh/git/config.sh
                                source ~/.zsh/node/setup.sh
                            </code>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
