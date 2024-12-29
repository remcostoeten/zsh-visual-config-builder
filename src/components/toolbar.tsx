import { Terminal, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface ToolbarProps {
	shellType: 'sh' | 'bash';
	onShellTypeChange: (type: 'sh' | 'bash') => void;
	onClearAll: () => void;
}

export default function Toolbar({
	shellType,
	onShellTypeChange,
	onClearAll,
}: ToolbarProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	return (
		<>
			<div className="bg-[#2D2D2D] border-b border-[#404040] p-2 flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Terminal className="w-4 h-4 text-gray-400" />
					<select
						value={shellType}
						onChange={(e) => onShellTypeChange(e.target.value as 'sh' | 'bash')}
						className="bg-[#1E1E1E] text-white px-2 py-1 rounded border border-[#505050] text-sm"
					>
						<option value="sh">Shell Script (.sh)</option>
						<option value="bash">Bash Script (.bash)</option>
					</select>
				</div>

				<div className="h-4 w-[1px] bg-[#404040]" />

				<button
					type="button"
					onClick={() => setShowConfirm(true)}
					className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
				>
					<Trash2 className="w-4 h-4" />
					Clear All
				</button>
			</div>

			<ConfirmDialog
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={onClearAll}
				title="Clear All Nodes"
				message="Are you sure you want to clear all nodes? This action cannot be undone."
			/>
		</>
	);
}
