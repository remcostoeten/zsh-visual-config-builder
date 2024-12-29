import { loader } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React from 'react';

loader.config({ monaco });

interface Props {
	value: string;
	onChange: (value: string) => void;
	language?: string;
}

export default function MonacoEditor({
	value,
	onChange,
	language = 'shell',
}: Props) {
	return (
		<div className="h-full w-full">
			<Editor
				height="100%"
				value={value}
				language={language}
				onChange={onChange}
				theme="vs-dark"
				options={{
					minimap: { enabled: false },
					fontSize: 14,
					lineNumbers: 'on',
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
			/>
		</div>
	);
}
