import { useEffect, useState } from 'react';
import type { ConfigNode, Position } from '../types/config';

const initializeNodePositions = (
	config: ConfigNode,
): Record<string, Position> => {
	const positions: Record<string, Position> = {
		[config.id]: { x: 100, y: 100 },
	};

	const initializeChildPositions = (
		node: ConfigNode,
		baseX: number,
		baseY: number,
		level = 0,
	) => {
		if (!node.children) return;

		node.children.forEach((child, index) => {
			const verticalSpacing = 200;
			const horizontalSpacing = 400;

			positions[child.id] = {
				x: baseX + horizontalSpacing,
				y: baseY + index * verticalSpacing,
			};

			if (child.children) {
				initializeChildPositions(
					child,
					baseX + horizontalSpacing,
					baseY + index * verticalSpacing,
					level + 1,
				);
			}
		});
	};

	if (config.children && config.children.length > 0) {
		initializeChildPositions(config, 100, 100, 0);
	}

	return positions;
};

export const useNodePositions = (config: ConfigNode) => {
	const [positions, setPositions] = useState<Record<string, Position>>(
		initializeNodePositions(config),
	);

	useEffect(() => {
		const newPositions = initializeNodePositions(config);
		setPositions(newPositions);
	}, [config]);

	const updatePosition = (id: string, position: Position) => {
		setPositions((prev) => ({
			...prev,
			[id]: position,
		}));
	};

	return { positions, updatePosition };
};
