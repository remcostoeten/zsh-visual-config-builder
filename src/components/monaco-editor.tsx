import React from 'react'
import Editor from '@monaco-editor/react'
import { FileCode } from 'lucide-react'
import { Dialog, DialogContent } from '@/shared/components/ui'
import ShellHelpers from './ShellHelpers'
import { Button } from './ui/button'
import { DialogTitle } from '@radix-ui/react-dialog'

interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    content: string
    onSave: (content: string) => void
    disableShellHelpers?: boolean
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
    const [editedContent, setEditedContent] = React.useState(content)

    React.useEffect(() => {
        setEditedContent(content)
    }, [content])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[80vw] h-[85vh] max-h-[900px] p-4 bg-[#1E1E1E] border-zinc-800 overflow-hidden flex flex-col">
                <div className="flex-shrink-0 mb-4">
                    <DialogTitle className="flex items-center gap-2 text-zinc-200">
                        <FileCode className="w-4 h-4" />
                        {title}
                        {isMainNode && (
                            <span className="text-xs text-zinc-400 font-normal">
                                (Source files and configuration only)
                            </span>
                        )}
                    </DialogTitle>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-[1fr_300px] gap-4 w-full">
                    <div className="h-full w-full relative rounded-lg overflow-hidden border border-zinc-800">
                        <Editor
                            value={editedContent}
                            onChange={value => setEditedContent(value || '')}
                            language="shell"
                            theme="vs-dark"
                            height="100%"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                readOnly: false,
                                validateOnType: isMainNode,
                                onValidate: isMainNode
                                    ? markers => {
                                          const validLines = editedContent
                                              .split('\n')
                                              .every(line => {
                                                  const trimmed = line.trim()
                                                  return (
                                                      trimmed.startsWith('source') ||
                                                      trimmed.startsWith('#') ||
                                                      trimmed === '' ||
                                                      trimmed.startsWith('[ ! -d') || // Allow directory creation
                                                      trimmed.startsWith('mkdir') // Allow mkdir commands
                                                  )
                                              })
                                          if (!validLines) {
                                              markers.push({
                                                  message:
                                                      'Only source commands, directory creation, and comments are allowed in .zshrc',
                                                  severity: 8,
                                                  startLineNumber: 1,
                                                  startColumn: 1,
                                                  endLineNumber: 1,
                                                  endColumn: 1
                                              })
                                          }
                                      }
                                    : undefined,
                                automaticLayout: true,
                                padding: { top: 8, bottom: 8 },
                            }}
                        />
                    </div>

                    <div className="h-full w-full overflow-hidden rounded-lg border border-zinc-800">
                        {isMainNode ? (
                            <div className="h-full overflow-y-auto p-4">
                                <h3 className='text-sm font-medium text-white/80 mb-2'>
                                    Main Configuration
                                </h3>
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
                                        # Create Shell Config directories [ ! -d ~/.zsh ] && mkdir -p
                                        ~/.zsh/{(core, git, node)}# Source configuration files
                                        source ~/.zsh/core/aliases.sh source ~/.zsh/git/config.sh
                                        source ~/.zsh/node/setup.sh
                                    </code>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full">
                                <ShellHelpers
                                    onInsertSnippet={snippet => {
                                        setEditedContent(prev => prev + '\n' + snippet)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 flex items-center justify-end gap-2 mt-4">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => onSave(editedContent)}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
