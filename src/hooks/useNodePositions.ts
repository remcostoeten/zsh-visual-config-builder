import { useState, useEffect } from 'react';
import type { ConfigNode, Position } from '../types/config';

export const useNodePositions = (config: ConfigNode) => {
    const [positions, setPositions] = useState<Record<string, Position>>({});

    useEffect(() => {
        // Initialize positions for the root node
        const initializePositions = () => {
            const newPositions: Record<string, Position> = {
                [config.id]: { x: 50, y: 50 }
            };

            // Initialize positions for children
            const initializeChildPositions = (node: ConfigNode, baseX: number, baseY: number) => {
                node.children?.forEach((child, index) => {
                    newPositions[child.id] = {
                        x: baseX + 350,
                        y: baseY + (index * 150)
                    };
                    initializeChildPositions(child, baseX + 350, baseY + (index * 150));
                });
            };

            initializeChildPositions(config, 50, 50);
            setPositions(newPositions);
        };

        initializePositions();
    }, [config]);

    const updatePosition = (id: string, position: Position) => {
        setPositions(prev => ({
            ...prev,
            [id]: position
        }));
    };

    return { positions, updatePosition };
};