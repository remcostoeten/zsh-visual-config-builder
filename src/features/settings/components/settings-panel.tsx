import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas } from '../../../shared/stores/canvas';
import { 
  Gear,
  Lock, 
  LockOpen, 
  RotateLeft,
  RotateRight,
  Repeat
} from '../../../shared/components/icons';

export function SettingsPanel() {
  const { settings, updateSettings, rotateArtboard, resetRotation, toggleArtboardLock } = useCanvas();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="absolute top-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg"
      >
        <Gear className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-0 w-72 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl p-4 space-y-6"
          >
            {/* Artboard Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Artboard</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lock Movement</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleArtboardLock}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded"
                  >
                    {settings.artboard.locked ? (
                      <Lock className="w-4 h-4 text-blue-500" weight="duotone" />
                    ) : (
                      <LockOpen className="w-4 h-4 text-gray-400" weight="duotone" />
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rotation: {settings.artboard.rotation}°
                  </span>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => rotateArtboard('left')}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded"
                    >
                      <RotateLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => rotateArtboard('right')}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded"
                    >
                      <RotateRight className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetRotation}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded"
                    >
                      <Repeat className="w-4 h-4 text-gray-600 dark:text-gray-400" weight="duotone" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Connectors</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    Type
                  </label>
                  <select
                    value={settings.connectors.type}
                    onChange={(e) => updateSettings({
                      connectors: { ...settings.connectors, type: e.target.value as 'bezier' | 'orthogonal' }
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="bezier">Curved (Bezier)</option>
                    <option value="orthogonal">Straight (Orthogonal)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.connectors.color}
                      onChange={(e) => updateSettings({
                        connectors: { ...settings.connectors, color: e.target.value }
                      })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.connectors.color}
                      onChange={(e) => updateSettings({
                        connectors: { ...settings.connectors, color: e.target.value }
                      })}
                      className="flex-1 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    Thickness: {settings.connectors.thickness}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={settings.connectors.thickness}
                    onChange={(e) => updateSettings({
                      connectors: { ...settings.connectors, thickness: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Animate Lines
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.connectors.animate}
                      onChange={(e) => updateSettings({
                        connectors: { ...settings.connectors, animate: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Pattern Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Pattern</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    Type
                  </label>
                  <select
                    value={settings.pattern.type}
                    onChange={(e) => updateSettings({
                      pattern: { 
                        ...settings.pattern, 
                        type: e.target.value as 'dots' | 'grid' | 'tiles' | 'none'
                      }
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="dots">Dots</option>
                    <option value="grid">Grid Lines</option>
                    <option value="tiles">Tiles</option>
                    <option value="none">None</option>
                  </select>
                </div>

                {settings.pattern.type !== 'none' && (
                  <>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                        Pattern Color & Opacity
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.pattern.color}
                          onChange={(e) => {
                            updateSettings({
                              pattern: {
                                ...settings.pattern,
                                color: e.target.value
                              }
                            });
                          }}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                        Grid Size: {settings.pattern.tileSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={settings.pattern.tileSize}
                        onChange={(e) => updateSettings({
                          pattern: { ...settings.pattern, tileSize: parseInt(e.target.value) }
                        })}
                        className="w-full"
                      />
                    </div>

                    {settings.pattern.type === 'dots' && (
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                          Dot Size: {settings.pattern.dotSize}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={settings.pattern.dotSize}
                          onChange={(e) => updateSettings({
                            pattern: { ...settings.pattern, dotSize: parseFloat(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}