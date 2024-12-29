import { Command, Info, Keyboard, MousePointerClick } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import type { ConfigNode } from '../types/config';

type CanvasInfoBarProps = {
	config: ConfigNode;
};

type ShortcutItem = {
	key: string;
	description: string;
};

const shortcuts: ShortcutItem[] = [
	{ key: '/', description: 'Open command menu' },
	{ key: '1-6', description: 'Quick execute commands' },
	{ key: 'Double-click canvas', description: 'Add new script' },
	{ key: 'Double-click node', description: 'Edit node' },
	{ key: 'Drag node', description: 'Move node position' },
	{ key: 'Esc', description: 'Close menus' },
	{ key: '↑↓', description: 'Navigate commands' },
	{ key: 'Enter', description: 'Execute command' },
];

const commands = [
	'clear all (1) - Reset canvas',
	'new partial (2) - Add partial script',
	'new injector (3) - Add injector script',
	'use sh (4) - Change to .sh',
	'use bash (5) - Change to .bash',
	'echo shell (6) - Show current shell',
];

export default function CanvasInfoBar({ config }: CanvasInfoBarProps) {
	const [showCheatSheet, setShowCheatSheet] = useState(false);
	const cheatSheetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				cheatSheetRef.current &&
				!cheatSheetRef.current.contains(event.target as Node)
			) {
				setShowCheatSheet(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setShowCheatSheet(false);
			}
		};

		if (showCheatSheet) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [showCheatSheet]);

	// Calculate statistics
	const countNodes = (node: ConfigNode): number => {
		let count = 1;
		if (node.children) {
			for (const child of node.children) {
				count += countNodes(child);
			}
		}
		return count;
	};

	const totalNodes = countNodes(config);
	const totalLevels = (node: ConfigNode, level = 1): number => {
		if (!node.children || node.children.length === 0) return level;
		return Math.max(
			...node.children.map((child) => totalLevels(child, level + 1)),
		);
	};

	return (
		<div className="bg-[#252525] border-b border-[#333] px-4 py-2 flex items-center justify-between text-sm">
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-2 text-gray-400">
					<Info className="w-4 h-4" />
					<span>Total Scripts: {totalNodes}</span>
					<span className="mx-2">•</span>
					<span>Max Level: {totalLevels(config)}</span>
				</div>
			</div>
			<div className="flex items-center gap-4 text-gray-400">
				<div className="flex items-center gap-2">
					<MousePointerClick className="w-4 h-4" />
					<span>Double-click canvas to add new script</span>
				</div>
				<div className="relative">
					<button
						type="button"
						onClick={() => setShowCheatSheet(!showCheatSheet)}
						className="flex items-center gap-2 px-2 py-1 hover:bg-[#333] rounded transition-colors"
					>
						<Keyboard className="w-4 h-4" />
						<span>Cheat Sheet</span>
					</button>
					{showCheatSheet && (
						<div
							ref={cheatSheetRef}
							className="absolute right-0 top-full mt-2 bg-[#2D2D2D] rounded-lg shadow-xl border border-[#404040] p-4 min-w-[300px] z-50"
						>
							<div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#404040]">
								<Keyboard className="w-4 h-4 text-indigo-400" />
								<h3 className="text-white font-medium">Keyboard Shortcuts</h3>
							</div>
							<div className="space-y-2 mb-4">
								{shortcuts.map((shortcut) => (
									<div
										key={shortcut.key}
										className="flex items-center justify-between gap-4"
									>
										<kbd className="px-2 py-1 bg-[#1A1A1A] rounded text-xs text-gray-400 border border-[#404040] shadow-[0_2px_0_0_#404040] min-w-[24px] inline-flex items-center justify-center">
											{shortcut.key}
										</kbd>
										<span className="text-gray-400">
											{shortcut.description}
										</span>
									</div>
								))}
							</div>
							<div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#404040]">
								<Command className="w-4 h-4 text-indigo-400" />
								<h3 className="text-white font-medium">Available Commands</h3>
							</div>
							<div className="space-y-2">
								{commands.map((command) => (
									<div key={command} className="text-gray-400 text-sm">
										{command}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
