import { useState } from 'react';
import type { Position } from '../types/config';

export const useQuickAdd = () => {
    const [quickAddPosition, setQuickAddPosition] = useState<Position | null>(null);

    const handleCanvasDoubleClick = (e: React.MouseEvent) => {
        // Prevent if clicking on the menu or if menu is already open
        if (quickAddPosition || (e.target as Element).closest('.quick-add-menu')) {
            return;
        }
        
        const rect = e.currentTarget.getBoundingClientRect();
        setQuickAddPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const createNewNode = (type: 'injector' | 'partial') => ({
        id: `node-${Math.random().toString(36).substr(2, 9)}`,
        title: type === 'injector' ? 'New Injector' : 'New Partial',
        content: '',
        type: type,
        children: []
    });

    const resetQuickAdd = () => setQuickAddPosition(null);

    return {
        quickAddPosition,
        handleCanvasDoubleClick,
        createNewNode,
        resetQuickAdd
    };
};