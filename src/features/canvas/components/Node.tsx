import React from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface NodeProps {
  isMain: boolean;
}

const Node: React.FC<NodeProps> = ({ isMain }) => {
  return (
    <div 
      className={cn(
        "group relative rounded-lg border transition-colors duration-150",
        "hover:border-indigo-500/50",
        "focus-within:border-indigo-500",
        isMain ? "border-[#333] bg-[#252525]" : "border-[#2A2A2A] bg-[#202020]"
      )}
    >
      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-full bg-[#333] hover:bg-[#444] text-white/70 hover:text-white">
          <Plus size={12} />
        </button>
      </div>
      {/* Rest of node content */}
    </div>
  );
};

export default Node; 