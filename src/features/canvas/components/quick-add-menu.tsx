import React from 'react';
import { FileCode, GitFork, Plus, Copy } from 'lucide-react';
import { Position, ConfigNode } from '@/types/config';
import { useCanvasStore } from '../canvas-slice';

interface Props {
  position: Position;
  onSelect: (type: 'injector' | 'partial', template?: ConfigNode) => void;
  onClose: () => void;
}

export default function QuickAddMenu({ position, onSelect, onClose }: Props) {
  const [showTemplates, setShowTemplates] = React.useState<'injector' | 'partial' | null>(null);
  const config = useCanvasStore(state => state.config);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const findInjectors = (node: ConfigNode): ConfigNode[] => {
    let injectors: ConfigNode[] = [];
    if (node.type === 'injector') {
      injectors.push(node);
    }
    if (node.children) {
      node.children.forEach(child => {
        injectors = [...injectors, ...findInjectors(child)];
      });
    }
    return injectors;
  };

  const existingInjectors = findInjectors(config);

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
      ref={menuRef}
      className="quick-add-menu absolute bg-[#252525] rounded-lg border border-[#333] shadow-xl p-2 w-48 animate-fadeIn z-50"
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {!showTemplates ? (
        <>
          <button
            onClick={() => onSelect('injector')}
            className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            Blank Injector
          </button>
          <button
            onClick={() => onSelect('partial')}
            className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            Blank Partial
          </button>
          <div className="h-px bg-[#333] my-1" />
          <button
            onClick={() => setShowTemplates('injector')}
            className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
          >
            <GitFork className="w-4 h-4" />
            From Injector Template
          </button>
          <button
            onClick={() => setShowTemplates('partial')}
            className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
          >
            <FileCode className="w-4 h-4" />
            From Partial Template
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setShowTemplates(null)}
            className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors mb-1"
          >
            ← Back
          </button>
          <div className="h-px bg-[#333] mb-1" />
          {existingInjectors.map((injector) => (
            <button
              key={injector.id}
              onClick={() => {
                onSelect(showTemplates, injector);
                setShowTemplates(null);
              }}
              className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-[#333] rounded transition-colors"
            >
              <Copy className="w-4 h-4" />
              {injector.title}
            </button>
          ))}
        </>
      )}
    </div>
  );
}