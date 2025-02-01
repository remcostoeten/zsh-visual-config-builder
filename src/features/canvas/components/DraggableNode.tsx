import React, { useRef } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { File, Edit2, Link, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfigNode } from '@/types/config';
import MonacoEditorModal from './MonacoEditorModal';
import SourceFile from './SourceFile';
import { useCanvasStore } from '../canvas-slice';

interface Props {
  node: ConfigNode;
  onUpdate: (id: string, updates: Partial<ConfigNode>) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDrag: (id: string, x: number, y: number) => void;
  position: { x: number; y: number };
  onDelete?: (id: string) => void;
  onLink?: (id: string) => void;
}

export default function DraggableNode({ node, onUpdate, onPositionChange, onDrag, position, onDelete, onLink }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const { orientation, removeNode, startLinking, linkingNode, finishLinking } = useCanvasStore();
  const nodeRef = useRef(null);

  const sourceFiles = node.content.match(/source.*\.sh/g) || [];
  const isLinking = linkingNode !== null;

  const getNodeColors = () => {
    switch (node.type) {
      case 'main':
        return 'border-white/20 bg-white/[0.06]';
      case 'injector':
        return 'border-white/15 bg-white/[0.04]';
      case 'partial':
        return 'border-white/10 bg-white/[0.02]';
    }
  };

  const handleDrag = (_: any, data: DraggableData) => {
    onDrag(node.id, data.x, data.y);
  };

  const handleStop = (_: any, data: DraggableData) => {
    onPositionChange(node.id, data.x, data.y);
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkingNode && linkingNode.id !== node.id) {
      finishLinking(node.id);
    }
  };

  const getOrientationStyles = () => {
    switch (orientation) {
      case 'horizontal':
        return 'scale-x-[-1]';
      case 'vertical':
        return 'scale-y-[-1]';
      default:
        return '';
    }
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
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-[200px] rounded-lg border ${getNodeColors()} backdrop-blur-sm shadow-lg shadow-black/20`}
          >
            <div className="drag-handle flex items-center justify-between px-3 py-2 border-b border-white/5 cursor-move">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-white/[0.06] border border-white/10">
                  <span className="text-[10px] text-white/50 font-mono">{node.level}</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={node.title}
                    onChange={(e) => onUpdate(node.id, { title: e.target.value })}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditing(false);
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    className="bg-black/20 text-white text-sm px-2 py-0.5 rounded w-32 border border-white/10 focus:border-white/20 outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm text-white/80 font-medium truncate">{node.title}</span>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-white/40 hover:text-white/90 transition-colors rounded hover:bg-white/[0.06]"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {node.type !== 'main' && (
                  <>
                    <button
                      onClick={() => onLink?.(node.id)}
                      className="p-1 text-white/40 hover:text-white/90 transition-colors rounded hover:bg-white/[0.06]"
                    >
                      <Link className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete?.(node.id)}
                      className="p-1 text-white/40 hover:text-white/90 transition-colors rounded hover:bg-white/[0.06]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowEditor(true)}
              className="w-full px-3 py-2 text-left hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-center gap-2 text-white/40 group-hover:text-white/70">
                <File className="w-3.5 h-3.5" />
                <span className="text-[11px]">Edit Contents</span>
              </div>
            </button>
          </motion.div>
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