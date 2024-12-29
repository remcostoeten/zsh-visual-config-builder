import {
	ArrowDownFromLine,
	ArrowUpFromLine,
	ChevronDown,
	ChevronUp,
	FileCode,
	GitBranch,
	PenIcon,
	Terminal,
	X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import Draggable from 'react-draggable';
import type { ConfigNode, Position } from '../types/config';
import ContentEditorModal from './content-editor-modal';
import DependencyPopover from './dependency-popover';

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
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [isContentExpanded, setIsContentExpanded] = useState(true);
	const [showParentPopover, setShowParentPopover] = useState(false);
	const [showChildrenPopover, setShowChildrenPopover] = useState(false);

	const handleContentEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onUpdate(node.id, { content: e.target.value });
	};

	const handleTitleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value.replace(/\s+/g, '_');
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

	const getExtension = () => (shellType === 'bash' ? '.bash' : '.sh');

	const getNodeIcon = () => {
		switch (node.type) {
			case 'main':
				return <Terminal className="w-4 h-4 text-white/70" />;
			case 'injector':
				return <GitBranch className="w-4 h-4 text-white/70" />;
			case 'partial':
				return <FileCode className="w-4 h-4 text-white/70" />;
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

	const getNodeColor = () => {
		switch (node.type) {
			case 'main':
				return 'from-white/10 to-white/[0.02] border-white/20';
			case 'injector':
				return 'from-white/10 to-white/[0.02] border-white/20';
			case 'partial':
				return 'from-white/10 to-white/[0.02] border-white/20';
			default:
				return '';
		}
	};

	return (
		<>
			<Draggable
				position={position}
				onStart={() => setIsDragging(true)}
				onDrag={(_e, data) => {
					onDrag(node.id, { x: data.x, y: data.y });
				}}
				onStop={(_e, data) => {
					setIsDragging(false);
					onPositionChange(node.id, { x: data.x, y: data.y });
				}}
				bounds="parent"
				disabled={isEditorOpen}
			>
				<div
					className={`
						absolute cursor-move bg-gradient-to-b ${getNodeColor()}
						rounded-xl p-4 w-[280px] backdrop-blur-sm
						shadow-lg border transition-all duration-200
						${isDragging ? 'scale-105 shadow-2xl border-white/30' : ''}
						${isEditorOpen ? 'cursor-default border-white/30' : ''}
						hover:shadow-xl hover:border-white/30
					`}
				>
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-center gap-2 text-xs text-white/50 font-medium">
							{getNodeIcon()}
							<span>{getNodeTypeLabel()}</span>
						</div>
						<div className="flex items-center gap-2">
							{hasParent && (
								<div className="relative">
									<button
										type="button"
										onClick={() => setShowParentPopover(true)}
										className="flex items-center gap-1 text-xs text-white/50 hover:text-white/70 transition-colors"
									>
										<ArrowUpFromLine className="w-3 h-3" />
										<span>Depends</span>
									</button>
									{parent && (
										<DependencyPopover
											isOpen={showParentPopover}
											onClose={() => setShowParentPopover(false)}
											type="parent"
											nodes={[parent]}
											onNodeClick={onNodeClick}
										/>
									)}
								</div>
							)}
							{hasChildren && (
								<div className="relative">
									<button
										type="button"
										onClick={() => setShowChildrenPopover(true)}
										className="flex items-center gap-1 text-xs text-white/50 hover:text-white/70 transition-colors"
									>
										<ArrowDownFromLine className="w-3 h-3" />
										<span>Required</span>
									</button>
									<DependencyPopover
										isOpen={showChildrenPopover}
										onClose={() => setShowChildrenPopover(false)}
										type="children"
										nodes={childNodes}
										onNodeClick={onNodeClick}
									/>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between group">
							{isEditorOpen ? (
								<input
									type="text"
									value={getBaseName()}
									onChange={handleTitleEdit}
									className="w-full bg-black/20 text-white px-3 py-1.5 rounded-lg border border-white/10 focus:border-white/20 focus:outline-none"
									placeholder="Enter filename..."
								/>
							) : (
								<button
									type="button"
									className="flex items-center justify-between w-full group/title"
									onClick={() => setIsEditorOpen(true)}
								>
									<h3 className="text-white font-medium flex items-center">
										<span>{getBaseName()}</span>
										<span className="text-white/40">{getExtension()}</span>
									</h3>
									<PenIcon className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
								</button>
							)}
						</div>

						<div className="relative">
							<div className="flex items-center justify-between mb-2">
								<button
									type="button"
									onClick={() => setIsContentExpanded(!isContentExpanded)}
									className="flex items-center gap-1 text-xs text-white/50 hover:text-white/70"
								>
									{isContentExpanded ? (
										<ChevronUp className="w-3 h-3" />
									) : (
										<ChevronDown className="w-3 h-3" />
									)}
									<span>Content</span>
								</button>
								{isEditorOpen && (
									<button
										onClick={() => setIsEditorOpen(false)}
										className="text-white/40 hover:text-white/60"
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</div>

							{isContentExpanded && (
								<div className="relative">
									{isEditorOpen ? (
										<textarea
											value={node.content}
											onChange={handleContentEdit}
											className="w-full bg-black/20 text-white/90 px-3 py-2 rounded-lg border border-white/10 focus:border-white/20 focus:outline-none min-h-[100px] font-mono text-sm"
											placeholder="Enter script content..."
										/>
									) : (
										<div
											className="text-white/70 text-sm font-mono bg-black/20 px-3 py-2 rounded-lg border border-white/10 cursor-text"
											onClick={() => setIsEditorOpen(true)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													setIsEditorOpen(true);
												}
											}}
											role="button"
											tabIndex={0}
										>
											{node.content || 'Click to add content...'}
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</Draggable>

			<ContentEditorModal
				isOpen={isEditorOpen}
				onClose={() => setIsEditorOpen(false)}
				title={node.title}
				content={node.content}
				onSave={(newContent) => {
					onUpdate(node.id, { content: newContent });
					setIsEditorOpen(false);
				}}
			/>
		</>
	);
};

export default DraggableNode;
