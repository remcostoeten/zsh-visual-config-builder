import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import type { ConfigNode } from '../types/config';

type DependencyPopoverProps = {
	isOpen: boolean;
	onClose: () => void;
	type: 'parent' | 'children';
	nodes: ConfigNode[];
	onNodeClick: (nodeId: string) => void;
};

export default function DependencyPopover({
	isOpen,
	onClose,
	type,
	nodes,
	onNodeClick,
}: DependencyPopoverProps) {
	const popoverRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			ref={popoverRef}
			className="absolute z-50 bg-[#2D2D2D] rounded-lg shadow-xl border border-[#404040] p-2 min-w-[200px] animate-fadeIn"
			style={{
				top: '100%',
				right: type === 'parent' ? 'auto' : 0,
				left: type === 'parent' ? 0 : 'auto',
				marginTop: '0.5rem',
			}}
		>
			<div className="flex items-center gap-2 mb-2 text-sm">
				{type === 'parent' ? (
					<>
						<ArrowUpFromLine className="w-4 h-4 text-orange-400" />
						<span className="text-orange-400">Depends on</span>
					</>
				) : (
					<>
						<ArrowDownFromLine className="w-4 h-4 text-green-400" />
						<span className="text-green-400">Required by</span>
					</>
				)}
			</div>
			<div className="space-y-1">
				{nodes.map((node) => (
					<button
						type="button"
						key={node.id}
						onClick={() => {
							onNodeClick(node.id);
							onClose();
						}}
						className="w-full text-left px-2 py-1 rounded text-sm text-gray-300 hover:bg-[#404040] transition-colors flex items-center gap-2"
					>
						<span className="truncate">{node.title}</span>
					</button>
				))}
			</div>
		</div>
	);
}
