import React, { useRef, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { validateShellScript } from '../../../utils/shell-validation'
import ShellHelpers from './shell-helpers'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Toast } from '@/shared/components/ui/toast/toast'

interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    content: string
    onSave: (content: string) => void
    node?: any
}

export default function MonacoEditorModal({ isOpen, onClose, title, content, onSave, node }: Props) {
    const [editorContent, setEditorContent] = useState(content)
    const [validation, setValidation] = React.useState({ isValid: true })
    const [showToast, setShowToast] = useState(false)
    const editorRef = useRef<any>(null)
    const isMainNode = node?.type === 'main'

    const handleEditorDidMount: OnMount = editor => {
        editorRef.current = editor
    }

    const validateMainNodeContent = (content: string): boolean => {
        const lines = content.split('\n')
        const validLines = lines.every(line => {
            const trimmed = line.trim()
            return (
                trimmed.startsWith('#') || // Comments are ok
                trimmed.startsWith('source') || // Source commands are ok
                trimmed.startsWith('for') || // For loops for sourcing are ok
                trimmed.startsWith('[') || // Directory checks are ok
                trimmed === '' // Empty lines are ok
            )
        })
        return validLines
    }

    const handleContentChange = (value: string) => {
        if (isMainNode) {
            if (!validateMainNodeContent(value)) {
                setShowToast(true)
                return
            }
        }
        setEditorContent(value)
    }

    const handleInsertSnippet = (code: string) => {
        if (editorRef.current) {
            const position = editorRef.current.getPosition()
            const lineContent = editorRef.current.getModel().getLineContent(position.lineNumber)
            const indentation = lineContent.match(/^\s*/)?.[0] || ''

            // Add a newline if we're not at the start of a line
            const insertText = position.column > 1 ? '\n' + code : code

            // Format the snippet with proper indentation
            const formattedCode = insertText
                .split('\n')
                .map((line, index) => (index === 0 ? line : indentation + line))
                .join('\n')

            editorRef.current.executeEdits('shell-helper', [
                {
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    },
                    text: formattedCode
                }
            ])

            // Update the content state
            const newContent = editorRef.current.getValue()
            setEditorContent(newContent)
            setValidation(validateShellScript(newContent))

            // Focus back on the editor
            editorRef.current.focus()
        }
    }

    if (!isOpen) return null

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className='max-w-[90vw] h-[80vh]'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-lg font-medium text-white/90'>{title}</h2>
                        <button onClick={onClose}>Close</button>
                    </div>

                    <div className='flex gap-4 h-[calc(100%-60px)]'>
                        <div className={`${isMainNode ? 'w-full' : 'flex-1'}`}>
                            <Editor
                                height='100%'
                                value={editorContent}
                                language='shell'
                                theme='vs-dark'
                                onChange={handleContentChange}
                                onMount={handleEditorDidMount}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    readOnly: false,
                                    // Add shell-specific suggestions for main node
                                    suggest: {
                                        showWords: !isMainNode,
                                        snippetsPreventQuickSuggestions: isMainNode
                                    }
                                }}
                            />
                        </div>

                        {!isMainNode && (
                            <div className='w-[300px]'>
                                <ShellHelpers onInsertSnippet={handleInsertSnippet} />
                            </div>
                        )}

                        {isMainNode && (
                            <div className='absolute bottom-4 left-4 right-4 bg-[#1E1E1E] p-4 rounded-lg border border-zinc-800'>
                                <div className='text-sm text-white/70'>
                                    <h3 className='font-medium mb-2'>Main Configuration File</h3>
                                    <p className='text-xs text-white/50 mb-2'>
                                        This file should only contain source statements for your configuration files.
                                    </p>
                                    <div className='bg-black/20 p-2 rounded text-xs'>
                                        <code>source ~/.zsh/core/aliases.sh</code>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {showToast && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Toast 
                        state="initial"
                        onDismiss={() => setShowToast(false)}
                        onReset={() => {
                            setEditorContent(content)
                            setShowToast(false)
                        }}
                    />
                </div>
            )}
        </>
    )
}
