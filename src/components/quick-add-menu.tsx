import type React from "react";
import { useRef, useEffect } from "react";
import { FileCode, GitFork } from "lucide-react";
import type { Position } from "../types/config";

interface Props {
	position: Position;
	onSelect: (type: "injector" | "partial") => void;
	onClose: () => void;
}

export default function QuickAddMenu({ position, onSelect, onClose }: Props) {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	const handleSelect = (type: "injector" | "partial", e: React.MouseEvent) => {
		e.stopPropagation();
		onSelect(type);
		onClose();
	};

	return (
		<div
			ref={menuRef}
			className="quick-add-menu absolute bg-[#252525] rounded-lg border border-[#333] shadow-xl p-2 w-48 animate-fadeIn z-50"
			style={{
				left: position.x,
				top: position.y,
				transform: "translate(-50%, -50%)",
			}}
		>
			<div className="flex flex-col gap-1">
				<button
					type="button"
					onClick={(e) => handleSelect("injector", e)}
					className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
				>
					<GitFork className="w-4 h-4" />
					Add Injector
				</button>
				<button
					type="button"
					onClick={(e) => handleSelect("partial", e)}
					className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
				>
					<FileCode className="w-4 h-4" />
					Add Partial
				</button>
			</div>
		</div>
	);
}
