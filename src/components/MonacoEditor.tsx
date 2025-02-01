import React from 'react'
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'

loader.config({ monaco })

interface Props {
    value: string
    onChange: (value: string) => void
    language?: string
}

export default function MonacoEditor({ value, onChange, language = 'shell' }: Props) {
    return <div className='h-full w-full'>{/* Monaco editor will be mounted here */}</div>
}
