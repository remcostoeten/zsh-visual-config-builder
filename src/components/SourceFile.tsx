import { File } from 'lucide-react';
import React from 'react';

interface Props {
	filename: string;
	onClick: () => void;
}

export default function SourceFile({ filename, onClick }: Props) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center text-sm hover:bg-[#252525] w-full px-2 py-1 rounded transition-colors"
		>
			<span className="text-[#4EC9B0]">source</span>
			<span className="text-white ml-2">{filename}</span>
		</button>
	);
}
