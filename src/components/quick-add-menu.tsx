import { FileCode, FilePlus } from 'lucide-react';
import React from 'react';

interface Props {
	position: { x: number; y: number };
	onSelect: (type: 'injector' | 'partial') => void;
}

export default function QuickAddMenu({ position, onSelect }: Props) {
	return (
		<div
			className="absolute bg-[#252525] rounded-lg shadow-lg p-2 min-w-[200px]"
			style={{
				left: position.x,
				top: position.y,
			}}
		>
			<div className="space-y-1">
				<button
					type="button"
					onClick={() => onSelect('injector')}
					className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-[#353535] rounded-md transition-colors group"
				>
					<FileCode className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
					<span className="text-sm">Add Injector</span>
				</button>

				<button
					type="button"
					onClick={() => onSelect('partial')}
					className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-[#353535] rounded-md transition-colors group"
				>
					<FilePlus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
					<span className="text-sm">Add Partial</span>
				</button>
			</div>
		</div>
	);
}
