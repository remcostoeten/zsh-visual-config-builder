import React from 'react';
import { Settings } from 'lucide-react';

interface Props {
  basePath: string;
  onPathChange: (path: string) => void;
}

export default function PathConfig({ basePath, onPathChange }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  
  return (
    <div className="flex items-center gap-2 text-gray-300">
      <Settings className="w-4 h-4" />
      Base path:{' '}
      {isEditing ? (
        <input
          type="text"
          value={basePath}
          onChange={(e) => onPathChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="bg-[#252525] border border-[#333] rounded px-2 py-1 text-sm"
          autoFocus
        />
      ) : (
        <button 
          onClick={() => setIsEditing(true)}
          className="hover:text-white transition-colors"
        >
          {basePath}
        </button>
      )}
    </div>
  );
}