'use client';

import Editor from '@monaco-editor/react';
import React, { useEffect } from 'react';

type ContentEditorModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	content: string;
	onSave: (content: string) => void;
};

export default function ContentEditorModal({
	isOpen,
	onClose,
	title,
	content,
	onSave,
}: ContentEditorModalProps) {
	const [editorContent, setEditorContent] = React.useState(content);

	useEffect(() => {
		setEditorContent(content);
	}, [content]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-[#1E1E1E] rounded-lg w-[1200px] h-[800px] p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium text-white">{title}</h2>
					<div className="space-x-2">
						<button
							type="button"
							onClick={() => onSave(editorContent)}
							className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
						>
							Save
						</button>
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
						>
							Close
						</button>
					</div>
				</div>

				<div className="h-[calc(100%-60px)]">
					<Editor
						height="100%"
						defaultValue={content}
						value={editorContent}
						language="shell"
						theme="vs-dark"
						onChange={(value) => setEditorContent(value || '')}
						options={{
							minimap: { enabled: false },
							fontSize: 14,
							lineNumbers: 'on',
							scrollBeyondLastLine: false,
							automaticLayout: true,
							wordWrap: 'on',
						}}
					/>
				</div>
			</div>
		</div>
	);
}
