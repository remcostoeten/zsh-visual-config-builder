import { Book, Code } from 'lucide-react';
import React from 'react';
import { ShellSnippet, shellSnippets } from '../utils/shell-snippets';

interface Props {
	onInsertSnippet: (code: string) => void;
}

export default function ShellHelpers({ onInsertSnippet }: Props) {
	const [selectedCategory, setSelectedCategory] = React.useState('all');

	const filteredSnippets = React.useMemo(() => {
		if (selectedCategory === 'all') return shellSnippets;
		return shellSnippets.filter((s) => s.category === selectedCategory);
	}, [selectedCategory]);

	return (
		<div className="p-4 bg-[#1E1E1E] text-gray-300 h-full">
			<div className="flex items-center gap-2 mb-4">
				<Book className="w-5 h-5" />
				<h2 className="text-lg font-medium">Shell Helpers</h2>
			</div>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setSelectedCategory('all')}
					className={`px-2 py-1 rounded text-sm ${
						selectedCategory === 'all'
							? 'bg-indigo-600 text-white'
							: 'hover:bg-[#333]'
					}`}
				>
					All
				</button>
				{['variable', 'loop', 'function', 'conditional'].map((category) => (
					<button
						type="button"
						key={category}
						onClick={() => setSelectedCategory(category)}
						className={`px-2 py-1 rounded text-sm ${
							selectedCategory === category
								? 'bg-indigo-600 text-white'
								: 'hover:bg-[#333]'
						}`}
					>
						{category}
					</button>
				))}
			</div>

			<div className="space-y-2">
				{filteredSnippets.map((snippet) => (
					<button
						type="button"
						key={snippet.id}
						onClick={() => onInsertSnippet(snippet.code)}
						className="w-full text-left p-2 rounded hover:bg-[#333] group"
					>
						<div className="flex items-center justify-between">
							<span className="text-white font-medium">{snippet.name}</span>
							<Code className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
						<p className="text-sm text-gray-400">{snippet.description}</p>
					</button>
				))}
			</div>
		</div>
	);
}
