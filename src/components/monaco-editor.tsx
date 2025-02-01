import React from 'react'
import Editor from '@monaco-editor/react'
import { FileCode } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import ShellHelpers from './ShellHelpers'
import { Button } from './ui/button'

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
            <DialogContent className='sm:max-w-[90vw] h-[80vh]'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <FileCode className='w-4 h-4' />
                        {title}
                        {isMainNode && (
                            <span className='text-xs text-gray-400 font-normal'>
                                (Source files and configuration only)
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className='grid grid-cols-[1fr,300px] gap-4 h-full'>
                    <div className='relative h-full'>
                        <Editor
                            value={editedContent}
                            onChange={value => setEditedContent(value || '')}
                            language='shell'
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
                                    : undefined
                            }}
                        />
                    </div>

                    <div className='h-full overflow-y-auto'>
                        {isMainNode ? (
                            <div className='p-4 bg-[#1E1E1E] rounded-lg'>
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
                                        # Create ZSH config directories [ ! -d ~/.zsh ] && mkdir -p
                                        ~/.zsh/{(core, git, node)}# Source configuration files
                                        source ~/.zsh/core/aliases.sh source ~/.zsh/git/config.sh
                                        source ~/.zsh/node/setup.sh
                                    </code>
                                </div>
                            </div>
                        ) : (
                            <div className='h-full'>
                                <ShellHelpers
                                    onInsertSnippet={snippet => {
                                        setEditedContent(prev => prev + '\n' + snippet)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onSave(editedContent)}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
