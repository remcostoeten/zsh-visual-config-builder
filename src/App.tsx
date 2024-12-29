import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import type { ConfigNode } from "./types/config";
import DraggableNode from "./components/draggable-node";
import AnimatedConnector from "./components/animated-connector";
import PathConfig from "./components/path-config";
import QuickAddMenu from "./components/quick-add-menu";
import Introduction from "./components/introduction";
import Footer from "./components/footer";
import { useNodePositions } from "./hooks/useNodePositions";
import { useQuickAdd } from "./hooks/useQuickAdd";
import { initialConfig } from "./config/initialConfig";
import { generateCommands } from "./utils/commands";
import Toolbar from "./components/toolbar";
import CanvasInfoBar from "./components/canvas-info-bar";
import CommandMenu from "./components/command-menu";

const defaultSettings = {
	// Theme Settings
	theme: "dark" as const,
	accentColor: "#6366f1",
	connectorColor: "#6366f1",

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
	layout: "horizontal" as const,
	autoLayout: true,
	snapToGrid: false,
	gridSize: 20,

	// Shell Settings
	useShebang: true,
	shebangType: "zsh" as const,
	defaultShebang: true,

	// Export Settings
	indentSize: 2,
	useSpaces: true,
	addComments: true,
	groupByType: true,
};

export default function App() {
	const { positions, updatePosition } = useNodePositions(initialConfig);
	const {
		quickAddPosition,
		handleCanvasDoubleClick,
		createNewNode,
		resetQuickAdd,
	} = useQuickAdd();
	const [config, setConfig] = useState(initialConfig);
	const [basePath, setBasePath] = useState("$HOME/.zsh");
	const [shellType, setShellType] = useState<"sh" | "bash">("sh");
	const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

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
			id: "root",
			title: "main.sh",
			content: "",
			type: "main",
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

	const handleQuickAdd = (type: "injector" | "partial") => {
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
		parentNode: ConfigNode | undefined = undefined
	): JSX.Element[] => {
		const nodeElements: JSX.Element[] = [];
		const hasChildren = node.children && node.children.length > 0;

		const handleNodeClick = (nodeId: string) => {
			// Find the node position and scroll it into view
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
					nodeElements.push(
						<AnimatedConnector
							key={`${node.id}-${child.id}`}
							start={{ x: startPos.x + 280, y: startPos.y + 40 }}
							end={{ x: endPos.x, y: endPos.y + 40 }}
							settings={defaultSettings}
						/>,
					);
				}
				
				nodeElements.push(...renderNodes(child, level + 1, true, node));
			}
		}

		return nodeElements;
	};

	return (
		<div className="h-screen flex flex-col">
			<Toolbar
				shellType={shellType}
				onShellTypeChange={setShellType}
				onClearAll={handleClearAll}
			/>
			<CommandMenu
				isOpen={isCommandMenuOpen}
				onClose={() => setIsCommandMenuOpen(false)}
				onClearAll={handleClearAll}
				onNewNode={handleQuickAdd}
				shellType={shellType}
				onShellTypeChange={setShellType}
			/>
			<div className="min-h-screen p-8 pb-20 bg-[#1A1A1A]">
				<div className="max-w-[1200px] mx-auto">
					<div className="flex justify-between items-center mb-8">
						<div className="space-y-2">
							<h1 className="text-2xl font-bold text-white">
								ZSH Config Visual Editor
							</h1>
							<PathConfig basePath={basePath} onPathChange={setBasePath} />
						</div>
						<button
							type="button"
							onClick={() => {
								const commands = generateCommands(
									config,
									basePath,
									defaultSettings,
								);
								navigator.clipboard.writeText(commands);
								alert("Commands copied to clipboard!");
							}}
							className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
						>
							<Download className="w-4 h-4" />
							Generate & Copy Commands
						</button>
					</div>

					<Introduction />

					<div
						className="relative h-[800px] rounded-xl bg-[#1E1E1E] border border-[#333] overflow-hidden mt-8"
						onDoubleClick={handleCanvasDoubleClick}
					>
						<CanvasInfoBar config={config} />
						{renderNodes(config)}
						{quickAddPosition && (
							<QuickAddMenu
								position={quickAddPosition}
								onSelect={handleQuickAdd}
								onClose={resetQuickAdd}
							/>
						)}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}
