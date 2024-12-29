import { Edit2, File } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { ConfigNode as ConfigNodeType } from '../types/config';
import MonacoEditor from './MonacoEditor';

interface Props {
	node: ConfigNodeType;
	onTitleChange: (title: string) => void;
	onContentChange: (content: string) => void;
}

export default function ConfigNode({
	node,
	onTitleChange,
	onContentChange,
}: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [title, setTitle] = useState(node.title);

	const handleTitleChange = () => {
		if (title !== node.title) {
			onTitleChange(title);
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleTitleChange();
		} else if (e.key === 'Escape') {
			setTitle(node.title);
			setIsEditing(false);
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					{isEditing ? (
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={handleTitleChange}
							onKeyDown={handleKeyDown}
							className="w-full px-2 py-1 rounded border"
						/>
					) : (
						<>
							<span className="font-medium">{node.title}</span>
							<button
								type="button"
								onClick={() => setIsEditing(true)}
								className="text-gray-400 hover:text-gray-600"
							>
								<Edit2 className="w-4 h-4" />
							</button>
						</>
					)}
				</div>

				<div
					className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
					onClick={() => setShowEditor(true)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							setShowEditor(true);
						}
					}}
					role="button"
					tabIndex={0}
				>
					<File className="w-4 h-4" />
					<span>Edit contents</span>
				</div>
			</div>

			{showEditor && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg w-[800px] h-[600px] p-4">
						<div className="flex justify-between mb-4">
							<h2 className="text-lg font-medium">{node.title}</h2>
							<button
								type="button"
								onClick={() => setShowEditor(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								Close
							</button>
						</div>
						<div className="h-[calc(100%-4rem)]">
							<MonacoEditor
								value={node.content}
								onChange={onContentChange}
								language="shell"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
