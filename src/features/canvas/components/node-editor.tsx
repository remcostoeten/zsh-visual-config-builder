import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Link, Unlink } from '../../../shared/components/icons';
import { useLayers } from '../../../shared/stores/layers';

interface NodeEditorProps {
  layerId: string;
  onClose: () => void;
}

export function NodeEditor({ layerId, onClose }: NodeEditorProps) {
  const { layers, setLayerParent, updateLayerId } = useLayers();
  const currentNode = layers.find(l => l.id === layerId);
  const [newId, setNewId] = React.useState(layerId);
  const [selectedParent, setSelectedParent] = React.useState(currentNode?.parent || '');
  
  if (!currentNode) return null;

  const parent = layers.find(l => l.id === currentNode.parent);
  const siblings = layers.filter(l => l.parent === currentNode.parent && l.id !== layerId);
  const children = layers.filter(l => l.parent === layerId);
  const possibleParents = layers.filter(l => l.id !== layerId && !isDescendant(l.id, layerId, layers));
  const isIdTaken = (id: string) => layers.some(l => l.id !== layerId && l.id === id);

  function isDescendant(nodeId: string, ancestorId: string, nodes: typeof layers): boolean {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return false;
    if (!node.parent) return false;
    if (node.parent === ancestorId) return true;
    return isDescendant(node.parent, ancestorId, nodes);
  }

  const handleIdUpdate = () => {
    if (newId && newId !== layerId && !isIdTaken(newId)) {
      updateLayerId(layerId, newId);
    }
  };

  const handleParentUpdate = (parentId: string) => {
    setLayerParent(layerId, parentId || undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            Edit Node Hierarchy
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
          >
            <X className="w-5 h-5 text-gray-500" weight="bold" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Node ID */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Link className="w-4 h-4" weight="duotone" />
              Node ID
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                placeholder="Enter unique ID"
              />
              <button
                onClick={handleIdUpdate}
                disabled={!newId || newId === layerId || isIdTaken(newId)}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update ID
              </button>
            </div>
            {isIdTaken(newId) && newId !== layerId && (
              <p className="text-xs text-red-500 mt-1">This ID is already taken</p>
            )}
          </div>

          {/* Current Node */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Node
            </h4>
            <div className="p-3 bg-gray-50 dark:bg-[#2A2A2A] rounded-lg">
              <div className="text-sm text-gray-900 dark:text-white font-medium">
                {currentNode.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentNode.metadata || 'No metadata'}
              </div>
            </div>
          </div>

          {/* Parent Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                {currentNode.parent ? (
                  <Link className="w-4 h-4" weight="duotone" />
                ) : (
                  <Unlink className="w-4 h-4" weight="duotone" />
                )}
              Parent Node
              </div>
            </h4>
            <select
              value={selectedParent}
              onChange={(e) => {
                setSelectedParent(e.target.value);
                handleParentUpdate(e.target.value);
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
            >
              <option value="">No parent</option>
              {possibleParents.map(node => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Parent */}
          {parent && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Parent
              </h4>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                  {parent.name}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {parent.metadata || 'No metadata'}
                </div>
              </motion.div>
            </div>
          )}

          {/* Siblings */}
          {siblings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Siblings
              </h4>
              <div className="space-y-2">
                {siblings.map(sibling => (
                  <motion.div
                    key={sibling.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-gray-50 dark:bg-[#2A2A2A] rounded-lg flex items-center"
                  >
                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {sibling.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {sibling.metadata || 'No metadata'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {children.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Children
              </h4>
              <div className="space-y-2">
                {children.map(child => (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg ml-4 relative"
                  >
                    <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2">
                      <ArrowRight className="w-4 h-4 text-purple-400 dark:text-purple-500" />
                    </div>
                    <div className="text-sm text-purple-900 dark:text-purple-100 font-medium">
                      {child.name}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">
                      {child.metadata || 'No metadata'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}