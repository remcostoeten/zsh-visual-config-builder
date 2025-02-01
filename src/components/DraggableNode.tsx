import React, { useRef } from 'react';
import { Edit2, File } from 'lucide-react';
import Draggable, { DraggableData } from 'react-draggable';
import { ConfigNode as ConfigNodeType } from '../types/config';
import MonacoEditorModal from './MonacoEditorModal';
import SourceFile from './SourceFile';

interface Props {
  node: ConfigNodeType;
  onUpdate: (id: string, updates: Partial<ConfigNodeType>) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDrag: (id: string, x: number, y: number) => void;
  position: { x: number, y: number };
}

export default function DraggableNode({ node, onUpdate, onPositionChange, onDrag, position }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const nodeRef = useRef(null);

  const sourceFiles = node.content.match(/source.*\.sh/g) || [];

  const handleDrag = (_: any, data: DraggableData) => {
    onDrag(node.id, data.x, data.y);
  };

  const handleStop = (_: any, data: DraggableData) => {
    onPositionChange(node.id, data.x, data.y);
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        onStop={handleStop}
        bounds="parent"
        handle=".drag-handle"
      >
        <div ref={nodeRef} className="absolute">
          <div className="w-[280px] bg-[#1E1E1E] rounded-lg overflow-hidden shadow-xl border border-[#333]">
            <div className="flex items-center justify-between px-3 py-2 bg-[#252525] border-b border-[#333] drag-handle cursor-move">
              {isEditing ? (
                <input
                  type="text"
                  value={node.title}
                  onChange={(e) => onUpdate(node.id, { title: e.target.value })}
                  onBlur={() => setIsEditing(false)}
                  className="bg-[#333] text-white px-2 py-1 rounded w-full mr-2"
                  autoFocus
                />
              ) : (
                <span className="text-white font-medium">{node.title}</span>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditor(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <File className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-3 space-y-1">
              {sourceFiles.map((file, index) => (
                <SourceFile
                  key={index}
                  filename={file.replace('source ', '')}
                  onClick={() => {
                    const childNode = node.children?.find(
                      child => file.includes(child.title)
                    );
                    if (childNode) {
                      setShowEditor(true);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Draggable>

      <MonacoEditorModal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        title={node.title}
        content={node.content}
        onSave={(content) => {
          onUpdate(node.id, { content });
          setShowEditor(false);
        }}
      />
    </>
  );
}