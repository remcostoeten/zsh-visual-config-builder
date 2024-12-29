import type React from "react";
import Draggable from "react-draggable";
import type { ConfigNode, Position } from "../types/config";
import { useState } from "react";
import { PenIcon, GitBranch, FileCode, Terminal, ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";
import DependencyPopover from "./dependency-popover";

interface DraggableNodeProps {
	node: ConfigNode;
	position: Position;
	onUpdate: (id: string, updates: Partial<ConfigNode>) => void;
	onPositionChange: (id: string, position: Position) => void;
	onDrag: (id: string, position: Position) => void;
	shellType: 'sh' | 'bash';
	level?: number;
	hasParent?: boolean;
	hasChildren?: boolean;
	parent?: ConfigNode;
	childNodes?: ConfigNode[];
	onNodeClick?: (nodeId: string) => void;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({
	node,
	position,
	onUpdate,
	onPositionChange,
	onDrag,
	shellType,
	level = 0,
	hasParent = false,
	hasChildren = false,
	parent,
	childNodes = [],
	onNodeClick,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isTitleHovered, setIsTitleHovered] = useState(false);
	const [showParentPopover, setShowParentPopover] = useState(false);
	const [showChildrenPopover, setShowChildrenPopover] = useState(false);

	const handleContentEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onUpdate(node.id, { content: e.target.value });
	};

	const handleTitleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value.replace(/\s+/g, "_");
		onUpdate(node.id, { title: newTitle });
	};

	const getBaseName = () => {
		const title = node.title;
		if (title.endsWith('.sh')) {
			return title.slice(0, -3);
		}
		if (title.endsWith('.bash')) {
			return title.slice(0, -5);
		}
		return title;
	};

	const getExtension = () => shellType === 'bash' ? '.bash' : '.sh';

	const getNodeIcon = () => {
		switch (node.type) {
			case 'main':
				return <Terminal className="w-4 h-4 text-blue-400" />;
			case 'injector':
				return <GitBranch className="w-4 h-4 text-purple-400" />;
			case 'partial':
				return <FileCode className="w-4 h-4 text-green-400" />;
			default:
				return null;
		}
	};

	const getNodeTypeLabel = () => {
		const labels = {
			main: 'Main Script',
			injector: 'Injector',
			partial: 'Partial',
		};
		const displayLevel = node.type === 'main' ? 1 : level + 1;
		return `${labels[node.type]} (Level ${displayLevel})`;
	};

	const handleNodeClick = (nodeId: string) => {
		if (onNodeClick) {
			onNodeClick(nodeId);
		}
	};

	return (
		<Draggable
			position={position}
			onStart={() => setIsDragging(true)}
			onDrag={(e, data) => {
				onDrag(node.id, { x: data.x, y: data.y });
			}}
			onStop={(e, data) => {
				setIsDragging(false);
				onPositionChange(node.id, { x: data.x, y: data.y });
			}}
			bounds="parent"
			disabled={isEditing}
		>
			<div
				className={`
					absolute cursor-move bg-[#2D2D2D] rounded-lg p-4 w-[280px] 
					shadow-lg border border-[#404040] transition-shadow duration-200
					${isDragging ? "shadow-xl border-indigo-500" : ""}
					${isEditing ? "cursor-default" : ""}
					hover:border-[#505050]
				`}
				onDoubleClick={() => setIsEditing(true)}
				onBlur={() => setIsEditing(false)}
			>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2 text-xs text-gray-500">
						{getNodeIcon()}
						<span>{getNodeTypeLabel()}</span>
					</div>
					<div className="flex items-center gap-2">
						{hasParent && (
							<div className="relative">
								<button
									type="button"
									onClick={() => setShowParentPopover(true)}
									className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
								>
									<ArrowUpFromLine className="w-3 h-3" />
									<span>Depends on</span>
								</button>
								{parent && (
									<DependencyPopover
										isOpen={showParentPopover}
										onClose={() => setShowParentPopover(false)}
										type="parent"
										nodes={[parent]}
										onNodeClick={handleNodeClick}
									/>
								)}
							</div>
						)}
						{hasChildren && (
							<div className="relative">
								<button
									type="button"
									onClick={() => setShowChildrenPopover(true)}
									className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
								>
									<ArrowDownFromLine className="w-3 h-3" />
									<span>Required by</span>
								</button>
								<DependencyPopover
									isOpen={showChildrenPopover}
									onClose={() => setShowChildrenPopover(false)}
									type="children"
									nodes={childNodes}
									onNodeClick={handleNodeClick}
								/>
							</div>
						)}
					</div>
				</div>
				{isEditing ? (
					<div className="space-y-2">
						<input
							type="text"
							value={getBaseName()}
							onChange={handleTitleEdit}
							className="w-full bg-[#1E1E1E] text-white px-2 py-1 rounded border border-[#505050]"
						/>
						<textarea
							value={node.content}
							onChange={handleContentEdit}
							className="w-full bg-[#1E1E1E] text-gray-400 px-2 py-1 rounded border border-[#505050] min-h-[100px]"
						/>
					</div>
				) : (
					<>
						<button
							type="button"
							className="flex items-center justify-between w-full group/title"
							onMouseEnter={() => setIsTitleHovered(true)}
							onMouseLeave={() => setIsTitleHovered(false)}
							onClick={() => setIsEditing(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setIsEditing(true);
								}
							}}
						>
							<h3 className="text-white font-medium flex items-center">
								<span>{getBaseName()}</span>
								<span className="text-gray-500">{getExtension()}</span>
							</h3>
							{isTitleHovered && (
								<PenIcon className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
							)}
						</button>
						<div className="text-gray-400 text-sm mt-2">{node.content}</div>
					</>
				)}
			</div>
		</Draggable>
	);
};

export default DraggableNode;
