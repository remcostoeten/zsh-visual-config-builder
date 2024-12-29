import { Command, Search } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';

interface CommandMenuProps {
	isOpen: boolean;
	onClose: () => void;
	onClearAll: () => void;
	onNewNode: (type: 'injector' | 'partial') => void;
	shellType: 'sh' | 'bash';
	onShellTypeChange: (type: 'sh' | 'bash') => void;
}

interface CommandItem {
	id: string;
	label: string;
	execute: () => void;
	keywords?: string[];
	shortcut?: string;
}

const createCommands = (
	shellType: string,
	onClearAll: () => void,
	onNewNode: (type: 'injector' | 'partial') => void,
	onShellTypeChange: (type: 'sh' | 'bash') => void,
	onClose: () => void,
): CommandItem[] => [
	{
		id: 'clear-all',
		label: 'Clear All',
		execute: () => {
			onClearAll();
			onClose();
		},
		keywords: ['reset', 'delete', 'remove', 'clear'],
		shortcut: '1',
	},
	{
		id: 'new-partial',
		label: 'New Partial',
		execute: () => {
			onNewNode('partial');
			onClose();
		},
		keywords: ['add', 'create', 'script', 'partial'],
		shortcut: '2',
	},
	{
		id: 'new-injector',
		label: 'New Injector',
		execute: () => {
			onNewNode('injector');
			onClose();
		},
		keywords: ['add', 'create', 'script', 'injector'],
		shortcut: '3',
	},
	{
		id: 'use-sh',
		label: 'Use Shell (.sh)',
		execute: () => {
			onShellTypeChange('sh');
			onClose();
		},
		keywords: ['shell', 'extension', 'sh', 'use sh'],
		shortcut: '4',
	},
	{
		id: 'use-bash',
		label: 'Use Bash (.bash)',
		execute: () => {
			onShellTypeChange('bash');
			onClose();
		},
		keywords: ['shell', 'extension', 'bash', 'use bash'],
		shortcut: '5',
	},
	{
		id: 'echo-shell',
		label: 'Show Current Shell',
		execute: () => {
			const popup = document.createElement('div');
			popup.className =
				'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
			popup.innerHTML = `
				<div class="bg-[#2D2D2D] rounded-lg shadow-xl border border-[#404040] p-4 max-w-[400px] w-full mx-4">
					<div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#404040]">
						<svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 17l6-6-6-6"></path>
							<path d="M12 19h8"></path>
						</svg>
						<h3 class="text-white font-medium">Current Shell Configuration</h3>
					</div>
					<div class="text-gray-300 mb-4">
						Using <span class="text-indigo-400 font-medium">${shellType}</span> shell type
						<div class="text-gray-400 text-sm mt-1">
							Files will be saved with <span class="text-indigo-400 font-medium">.${shellType}</span> extension
						</div>
					</div>
					<button class="w-full px-4 py-2 bg-[#404040] text-white rounded hover:bg-[#4A4A4A] transition-colors">
						Close
					</button>
				</div>
			`;
			document.body.appendChild(popup);

			const closePopup = () => {
				document.body.removeChild(popup);
				onClose();
			};

			popup.querySelector('button')?.addEventListener('click', closePopup);
			popup.addEventListener('click', (e) => {
				if (e.target === popup) closePopup();
			});
		},
		keywords: ['show', 'display', 'type', 'shell', 'echo', 'current'],
		shortcut: '6',
	},
];

export default function CommandMenu({
	isOpen,
	onClose,
	onClearAll,
	onNewNode,
	shellType,
	onShellTypeChange,
}: CommandMenuProps) {
	const [query, setQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const commands = useMemo(
		() =>
			createCommands(
				shellType,
				onClearAll,
				onNewNode,
				onShellTypeChange,
				onClose,
			),
		[shellType, onClearAll, onNewNode, onShellTypeChange, onClose],
	);

	const filteredCommands = commands.filter((command) => {
		if (!query) return true;
		const searchTerms = query.toLowerCase().split(' ');
		return searchTerms.every(
			(term) =>
				command.label.toLowerCase().includes(term) ||
				command.keywords?.some((keyword) =>
					keyword.toLowerCase().includes(term),
				),
		);
	});

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) {
				if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
					e.preventDefault();
					onClose();
				}
				return;
			}

			// Handle number shortcuts
			if (!e.metaKey && !e.ctrlKey && !e.altKey) {
				const num = Number.parseInt(e.key);
				if (!Number.isNaN(num) && num > 0 && num <= commands.length) {
					e.preventDefault();
					commands[num - 1].execute();
					return;
				}
			}

			switch (e.key) {
				case 'Escape':
					onClose();
					break;
				case 'ArrowDown':
					e.preventDefault();
					setSelectedIndex((i) => (i + 1) % filteredCommands.length);
					break;
				case 'ArrowUp':
					e.preventDefault();
					setSelectedIndex(
						(i) => (i - 1 + filteredCommands.length) % filteredCommands.length,
					);
					break;
				case 'Enter':
					if (filteredCommands[selectedIndex]) {
						filteredCommands[selectedIndex].execute();
					}
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, filteredCommands, selectedIndex, onClose, commands]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50">
			<div className="bg-[#1E1E1E] border border-[#333] rounded-lg shadow-xl w-[500px] overflow-hidden">
				<div className="flex items-center gap-2 p-3 border-b border-[#333]">
					<Command className="w-5 h-5 text-gray-400" />
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setSelectedIndex(0);
						}}
						placeholder="Type a command or number (1-6)..."
						className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
					/>
					{query && <Search className="w-5 h-5 text-gray-400" />}
				</div>
				<div className="max-h-[300px] overflow-y-auto">
					{filteredCommands.map((command, index) => (
						<button
							type="button"
							key={command.id}
							onClick={() => command.execute()}
							onMouseEnter={() => setSelectedIndex(index)}
							className={`w-full text-left px-4 py-2 hover:bg-[#2D2D2D] flex items-center justify-between
                ${index === selectedIndex ? 'bg-[#2D2D2D]' : ''}`}
						>
							<span className="text-white">{command.label}</span>
							{command.shortcut && (
								<kbd className="px-2 py-1 bg-[#1A1A1A] rounded text-xs text-gray-400 ml-2 border border-[#404040] shadow-[0_2px_0_0_#404040] min-w-[20px] inline-flex items-center justify-center">
									{command.shortcut}
								</kbd>
							)}
						</button>
					))}
					{filteredCommands.length === 0 && (
						<div className="px-4 py-3 text-gray-500 text-center">
							No commands found
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
