import React from 'react';
import { FileCode, GitFork } from 'lucide-react';
import { Position } from '../types/config';

interface Props {
  position: Position;
  onSelect: (type: 'injector' | 'partial') => void;
  onClose: () => void;
}

export function QuickAddMenu({ position, onSelect, onClose }: Props) {
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.quick-add-menu')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      className="quick-add-menu absolute bg-[#252525] rounded-lg border border-[#333] shadow-xl p-2 w-48 animate-fadeIn z-50"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)' 
      }}
    >
      <button
        onClick={() => onSelect('injector')}
        className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
      >
        <GitFork className="w-4 h-4" />
        Add Injector
      </button>
      <button
        onClick={() => onSelect('partial')}
        className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
      >
        <FileCode className="w-4 h-4" />
        Add Partial
      </button>
    </div>
  );
}