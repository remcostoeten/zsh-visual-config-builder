import { Editor } from '@monaco-editor/react'
import { useTheme } from '@/shared/hooks/use-theme'

interface MonacoEditorProps {
    value: string
    onChange?: (value: string) => void
    language?: string
    height?: string | number
    readOnly?: boolean
}

export function MonacoEditor({
    value,
    onChange,
    language = 'shell',
    height = '300px',
    readOnly = false,
}: MonacoEditorProps) {
    const { theme } = useTheme()

    return (
        <Editor
            height={height}
            defaultLanguage={language}
            value={value}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            onChange={value => onChange?.(value || '')}
            options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                readOnly,
                lineNumbers: 'on',
                renderLineHighlight: 'none',
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden',
                },
            }}
        />
    )
} 