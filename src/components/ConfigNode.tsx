import React, { useState } from 'react';
import { Edit2, File } from 'lucide-react';
import { ConfigNode as ConfigNodeType } from '../types/config';
import MonacoEditor from './MonacoEditor';

interface Props {
  node: ConfigNodeType;
  onUpdate: (id: string, updates: Partial<ConfigNodeType>) => void;
}

export default function ConfigNode({ node, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="relative group">
      <div 
        className={`
          p-4 rounded-lg border-2 min-w-[200px]
          ${node.type === 'main' ? 'bg-blue-50 border-blue-200' : 
            node.type === 'injector' ? 'bg-purple-50 border-purple-200' : 
            'bg-green-50 border-green-200'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          {isEditing ? (
            <input
              type="text"
              value={node.title}
              onChange={(e) => onUpdate(node.id, { title: e.target.value })}
              onBlur={() => setIsEditing(false)}
              className="w-full px-2 py-1 rounded border"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-gray-800">{node.title}</h3>
          )}
          <button 
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div 
          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
          onClick={() => setShowEditor(true)}
        >
          <File className="w-4 h-4" />
          <span>Edit contents</span>
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[800px] h-[600px] p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-medium">{node.title}</h2>
              <button 
                onClick={() => setShowEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <MonacoEditor
              value={node.content}
              onChange={(value) => onUpdate(node.id, { content: value })}
              language="shell"
            />
          </div>
        </div>
      )}
    </div>
  );
}