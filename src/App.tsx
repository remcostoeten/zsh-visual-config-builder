import { MousePointerClick } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import DraggableNode from './components/draggable-node';
import Footer from './components/footer';
import FullscreenButton from './components/fullscreen-button';
import QuickAddMenu from './components/quick-add-menu';
import Toolbar from './components/toolbar';
import { configData } from './config/site-config';
import { useNodePositions } from './hooks/use-node-positions';
import { useQuickAdd } from './hooks/use-quick-add';
import type { ConfigNode } from './types/config';

type ConnectorStyle = 'animated' | 'gradient' | 'step' | 'dotted-marker';

const defaultSettings = {
	// Theme Settings
	theme: 'dark' as const,
	accentColor: '#6366f1',
	connectorColor: '#6366f1',

	// Animation Settings
	animationSpeed: 1000,
	dashLength: 4,
	lineWidth: 1.5,
	animationsEnabled: true,

	// Node Settings
	nodeWidth: 280,
	nodePadding: 16,
	nodeSpacing: 60,
	nodeBorderRadius: 8,
	nodeBackgroundOpacity: 1,

	// Layout Settings
	layout: 'vertical' as const,
	autoLayout: true,
	snapToGrid: false,
	gridSize: 20,

	// Shell Settings
	useShebang: true,
	shebangType: 'zsh' as const,
	defaultShebang: true,

	// Export Settings
	indentSize: 4,
	useSpaces: true,
	addComments: true,
	groupByType: true,

	// Connector Style
	connectorStyle: 'animated' as ConnectorStyle,
};

export default function App() {
	const { positions, updatePosition } = useNodePositions(configData);
	const {
		quickAddPosition,
		handleCanvasDoubleClick,
		createNewNode,
		resetQuickAdd,
	} = useQuickAdd();
	const [config, setConfig] = useState(configData);
	const [shellType, setShellType] = useState<'sh' | 'bash'>('sh');
	const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
	const [isZenMode, setIsZenMode] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Calculate total nodes and max level
	const calculateStats = (
		node: ConfigNode,
		level = 0,
	): { total: number; maxLevel: number } => {
		if (!node) return { total: 0, maxLevel: 0 };

		let total = 1; // Count current node
		let maxLevel = level;

		if (node.children) {
			for (const child of node.children) {
				const childStats = calculateStats(child, level + 1);
				total += childStats.total;
				maxLevel = Math.max(maxLevel, childStats.maxLevel);
			}
		}

		return { total, maxLevel };
	};

	const { total: totalNodes, maxLevel } = calculateStats(config);

	const toggleZenMode = useCallback(() => {
		setIsZenMode((prev) => !prev);
		document.documentElement.style.setProperty(
			'--zen-transition',
			'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
		);
		setTimeout(() => {
			document.documentElement.style.setProperty('--zen-transition', '');
		}, 500);
	}, []);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isZenMode) {
				toggleZenMode();
			}
		};

		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [isZenMode, toggleZenMode]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '/' && !e.metaKey && !e.ctrlKey && !isCommandMenuOpen) {
				e.preventDefault();
				setIsCommandMenuOpen(true);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isCommandMenuOpen]);

	const handleClearAll = () => {
		setConfig({
			id: 'root',
			title: 'main.sh',
			content: '',
			type: 'main',
			children: [],
		});
	};

	const updateNode = (id: string, updates: Partial<ConfigNode>) => {
		const updateNodeRecursive = (node: ConfigNode): ConfigNode => {
			if (node.id === id) {
				return { ...node, ...updates };
			}
			if (node.children) {
				return {
					...node,
					children: node.children.map(updateNodeRecursive),
				};
			}
			return node;
		};
		setConfig(updateNodeRecursive(config));
	};

	const handleQuickAdd = (type: 'injector' | 'partial') => {
		const newNode = createNewNode(type);
		setConfig((prev) => ({
			...prev,
			children: [...(prev.children || []), newNode],
		}));
		resetQuickAdd();
	};

	const renderNodes = (
		node: ConfigNode,
		level = 0,
		hasParent = false,
		parentNode: ConfigNode | undefined = undefined,
	): JSX.Element[] => {
		const nodeElements: JSX.Element[] = [];
		const hasChildren = node.children && node.children.length > 0;

		const handleNodeClick = (nodeId: string) => {
			const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
			if (nodeElement) {
				nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		};

		nodeElements.push(
			<DraggableNode
				key={node.id}
				node={node}
				onUpdate={updateNode}
				onPositionChange={updatePosition}
				onDrag={updatePosition}
				position={positions[node.id]}
				shellType={shellType}
				level={level}
				hasParent={hasParent}
				hasChildren={hasChildren}
				parent={parentNode}
				childNodes={node.children || []}
				onNodeClick={handleNodeClick}
				data-node-id={node.id}
			/>,
		);

		if (node.children) {
			for (const child of node.children) {
				const startPos = positions[node.id];
				const endPos = positions[child.id];

				if (startPos && endPos) {
					const nodeHeight = 80;
					const nodeWidth = defaultSettings.nodeWidth;
					const startY = startPos.y + nodeHeight / 2;
					const endY = endPos.y + nodeHeight / 2;
					const startX = startPos.x + nodeWidth;
					const endX = endPos.x;

					const horizontalOffset = Math.abs(endX - startX) * 0.5;
					const controlPoint1X = startX + horizontalOffset;
					const controlPoint2X = endX - horizontalOffset;

					const path = `
						M ${startX} ${startY}
						C ${controlPoint1X} ${startY},
						  ${controlPoint2X} ${endY},
						  ${endX} ${endY}
					`;

					nodeElements.push(
						<svg
							key={`connector-${node.id}-${child.id}`}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								pointerEvents: 'none',
								overflow: 'visible',
							}}
							role="img"
							aria-label={`Connector from ${node.title} to ${child.title}`}
						>
							<title>
								Connection between {node.title} and {child.title}
							</title>
							<defs>
								<linearGradient
									id={`gradient-${node.id}-${child.id}`}
									gradientUnits="userSpaceOnUse"
									x1={startX}
									y1={startY}
									x2={endX}
									y2={endY}
								>
									<stop offset="0%" stopColor="rgba(99, 102, 241, 0.8)" />
									<stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
									<stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" />
								</linearGradient>
								<filter id={`glow-${node.id}-${child.id}`}>
									<feGaussianBlur stdDeviation="2" result="coloredBlur" />
									<feMerge>
										<feMergeNode in="coloredBlur" />
										<feMergeNode in="SourceGraphic" />
									</feMerge>
								</filter>
								<marker
									id={`arrowhead-${node.id}-${child.id}`}
									markerWidth="12"
									markerHeight="8"
									refX="10"
									refY="4"
									orient="auto"
								>
									<path
										d="M0,0 L12,4 L0,8"
										fill="none"
										stroke="rgba(99, 102, 241, 0.8)"
										strokeWidth="1.5"
									/>
								</marker>
							</defs>
							<g filter={`url(#glow-${node.id}-${child.id})`}>
								<path
									d={path}
									stroke={`url(#gradient-${node.id}-${child.id})`}
									strokeWidth="2"
									fill="none"
									strokeDasharray="8,4"
									markerEnd={`url(#arrowhead-${node.id}-${child.id})`}
									style={{
										animation: 'dash 1.5s linear infinite',
									}}
								/>
							</g>
						</svg>,
					);
				}

				nodeElements.push(...renderNodes(child, level + 1, true, node));
			}
		}

		return nodeElements;
	};

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () =>
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
	}, []);

	return (
		<div
			className="h-screen flex flex-col"
			role="application"
			aria-label="ZSH Config Builder"
		>
			<header>
				<Toolbar
					shellType={shellType}
					onShellTypeChange={setShellType}
					onClearAll={handleClearAll}
				/>
			</header>

			<main className="flex-1 p-8 pb-20 bg-[#1A1A1A]">
				<div className="h-full max-w-[1440px] mx-auto">
					{/* Stats bar */}
					<div className="flex items-center justify-between mb-4 text-sm text-gray-400">
						<div className="flex items-center gap-4">
							<span>Total Scripts: {totalNodes}</span>
							<span>•</span>
							<span>Max Level: {maxLevel}</span>
						</div>
						<div className="flex items-center gap-2">
							<MousePointerClick className="w-4 h-4" />
							<span>Double-click to add</span>
						</div>
					</div>

					{/* Main canvas */}
					<div
						className="relative h-[calc(100vh-220px)] rounded-xl bg-[#1E1E1E] border border-[#333] overflow-hidden"
						onDoubleClick={handleCanvasDoubleClick}
					>
						<div className="absolute top-2 right-2 z-50">
							<FullscreenButton
								isFullscreen={isFullscreen}
								onClick={toggleFullscreen}
							/>
						</div>

						{renderNodes(config)}

						{quickAddPosition && (
							<QuickAddMenu
								position={quickAddPosition}
								onSelect={handleQuickAdd}
							/>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
