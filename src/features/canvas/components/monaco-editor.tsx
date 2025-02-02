"use client"

import { Button } from "@/shared/components/ui/button"
import { Terminal, FileCode, Copy, Trash2, ClipboardPaste, FileCheck } from "lucide-react"
import Editor from "@monaco-editor/react"
import { useRef } from "react"
import { ScrollArea } from "@/shared/components/ui/button"
import { Dialog, DialogContent } from "@/shared/components/ui"
import { DialogTitle } from "@radix-ui/react-dialog"

interface MainConfigEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
  initialContent?: string
}

const TEMPLATE = `#!/bin/zsh
# Shell Configuration
# Generated with Shell Config Builder

# Function to source files if they exist and are readable
function source_if_exists() {
    [ -r "$1" ] && source "$1"
}

# Function to recursively source all injector files
function source_injectors() {
    local search_dir="$1"
    for injector in $(find "$search_dir" -type f -name "*_injector.sh"); do
        source_if_exists "$injector"
    done
}

# Source all configuration files
source_injectors "$HOME/.zsh"`

export default function MainConfigEditor({ isOpen, onClose, onSave, initialContent = TEMPLATE }: MainConfigEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const formatCode = () => {
    editorRef.current?.getAction("editor.action.formatDocument").run()
  }

  const clearCode = () => {
    editorRef.current?.setValue("")
  }

  const copyCode = () => {
    const code = editorRef.current?.getValue()
    if (code) navigator.clipboard.writeText(code)
  }

  const pasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText()
      editorRef.current?.setValue(text)
    } catch (err) {
      console.error("Failed to paste:", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[80vw] h-[85vh] max-h-[900px] p-0 gap-0 bg-[#1E1E1E] border-zinc-800 overflow-hidden">
        <DialogTitle className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-zinc-200">Main Configuration</DialogTitle>
              <p className="text-sm text-zinc-400">
                This file automatically sources all injector files from your .zsh directory
              </p>
            </div>
          </div>
        </DialogTitle>

        <div className="grid md:grid-cols-[1fr_250px] divide-x divide-zinc-800" style={{ height: 'calc(100% - 130px)' }}>
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 flex items-center gap-1 p-2 bg-zinc-900/50 border-b border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={formatCode}
                className="h-8 px-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Format
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCode}
                className="h-8 px-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="h-8 px-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={pasteCode}
                className="h-8 px-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <ClipboardPaste className="w-4 h-4 mr-2" />
                Paste
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultValue={initialContent}
                language="shell"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 8, bottom: 8 },
                  fontFamily: "'JetBrains Mono', monospace",
                  renderWhitespace: "boundary",
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true },
                  folding: true,
                  foldingHighlight: true,
                  renderLineHighlight: "all",
                  suggest: {
                    showWords: false,
                    snippetsPreventQuickSuggestions: true,
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-[#1E1E1E] w-full">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    Directory Structure
                  </div>
                  <pre className="text-xs p-3 rounded-lg bg-zinc-900 font-mono whitespace-pre text-zinc-300 border border-zinc-800">
                    {`.zsh/
├── core/
│   ├── aliases_injector.sh
│   └── exports_injector.sh
├── plugins/
│   ├── git_injector.sh
│   └── docker_injector.sh
└── scripts/
    └── utils_injector.sh`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-200">About This File</h3>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li>• Sources all *_injector.sh files recursively</li>
                    <li>• Validates file existence before sourcing</li>
                    <li>• Maintains clean configuration structure</li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-end gap-2 p-3 border-t border-zinc-800 bg-zinc-900/50">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(editorRef.current?.getValue())}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

