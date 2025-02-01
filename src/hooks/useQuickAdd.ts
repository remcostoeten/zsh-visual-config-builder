import { useState, useCallback } from 'react';
import { Position, ConfigNode } from '../types/config';
import { generateId } from '../utils/generateId';

export function useQuickAdd() {
  const [quickAddPosition, setQuickAddPosition] = useState<Position | null>(null);

  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setQuickAddPosition({ x, y });
  }, []);

  const createNewNode = (type: 'injector' | 'partial'): ConfigNode => ({
    id: generateId(),
    title: type === 'injector' ? 'new_injector.sh' : 'new_partial.sh',
    content: '# New file content',
    type,
    children: type === 'injector' ? [] : undefined,
  });

  const resetQuickAdd = () => setQuickAddPosition(null);

  return {
    quickAddPosition,
    handleCanvasDoubleClick,
    createNewNode,
    resetQuickAdd,
  };
}