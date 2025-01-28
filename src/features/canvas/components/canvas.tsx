import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassPlus, MagnifyingGlassMinus, FileCode, Terminal, Command } from '@phosphor-icons/react';
import { FlowNode } from './flow-node';
import { Tooltip } from '../../../shared/components/tooltip';
import { useCanvas } from '../../../shared/stores/canvas';
import { useLayers } from '../../../shared/stores/layers';
import { SettingsPanel } from '../../settings/components/settings-panel';
import { LayerEditor } from './layer-editor';
import { NodeEditor } from './node-editor';
import { ConnectorGroup } from '../../../shared/components/connectors';
import type { Connector, Point } from '../../../shared/types/canvas';

type LayerType = 'shell_config' | 'main_injector' | 'env_injector' | 'alias_injector' | 'path_injector' | 'function_injector' | 'custom_injector';

interface LayerStyle {
  color?: string;
  opacity?: number;
  rotation?: number;
  [key: string]: string | number | undefined;
}

interface Layer {
  id: string;
  type: LayerType;
  name: string;
  parent?: string;
  metadata?: string;
  shellType?: 'zsh' | 'bash';
  sourceOrder?: number;
  validated?: boolean;
  validationErrors?: string[];
  code?: string;
  style?: LayerStyle;
  visible?: boolean;
}

const createLayerComponents = (layers: Layer[]) => {
  const components = {
    'shell_config': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<FileCode className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.shellType || 'zsh'}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="blue"
        shape="rectangle"
      />
    ),
    'main_injector': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Terminal className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata="Main Configuration"
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="purple"
        shape="rectangle"
      />
    ),
    'env_injector': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Command className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata="Environment Variables"
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="green"
        shape="rectangle"
      />
    ),
    'alias_injector': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Command className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata="Alias Definitions"
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="orange"
        shape="rectangle"
      />
    ),
    'path_injector': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Command className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata="PATH Modifications"
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="yellow"
        shape="rectangle"
      />
    ),
    'function_injector': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Terminal className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata="Shell Functions"
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="red"
        shape="rectangle"
      />
    ),
    'custom_injector': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Terminal className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata || 'Custom Injector'}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language="shell"
        variant="highlight"
        color="blue"
        shape="rectangle"
      />
    ),
  };
  return components;
};

const useLayerComponents = (layers: Layer[]) => 
  useMemo(() => createLayerComponents(layers), [layers]);

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.1;

const BackgroundPattern = React.memo(({ type, color, tileSize, dotSize, opacity }: {
  type: 'dots' | 'grid' | 'tiles' | 'none';
  color: string;
  tileSize: number;
  dotSize: number;
  opacity: number;
}) => {
  const patternId = useMemo(() => `pattern-${type}-${tileSize}-${dotSize}`, [type, tileSize, dotSize]);

  const patternContent = useMemo(() => {
    switch (type) {
      case 'dots':
        return (
          <circle 
            cx={tileSize/2} 
            cy={tileSize/2} 
            r={dotSize/2} 
            fill={color} 
          />
        );
      case 'grid':
        return (
          <path 
            d={`M ${tileSize} 0 L 0 0 0 ${tileSize}`} 
            stroke={color} 
            strokeWidth={dotSize} 
            fill="none" 
          />
        );
      case 'tiles':
        return (
          <rect 
            x="0" 
            y="0" 
            width={tileSize} 
            height={tileSize} 
            fill="none" 
            stroke={color} 
            strokeWidth={dotSize} 
          />
        );
      default:
        return null;
    }
  }, [type, color, tileSize, dotSize]);
  
  if (type === 'none') return null;
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ opacity }}
    >
      <defs>
        <pattern 
          id={patternId} 
          x="0" 
          y="0" 
          width={tileSize} 
          height={tileSize} 
          patternUnits="userSpaceOnUse"
        >
          {patternContent}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
});

BackgroundPattern.displayName = 'BackgroundPattern';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<{ layerId: string; position: Point } | null>(null);
  const [resizingLayer, setResizingLayer] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const [startResizePoint, setStartResizePoint] = useState<Point | null>(null);
  const [startLayerSize, setStartLayerSize] = useState<{ width: number; height: number } | null>(null);
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [spacePressed, setSpacePressed] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const {
    scale,
    position,
    settings,
    updateScale,
    updatePosition,
    setDragging
  } = useCanvas();

  const {
    layers,
    updateLayerPosition,
    updateLayerSize,
    selectLayer,
    setHoveredLayer
  } = useLayers();

  // Memoize layer components
  const layerComponents = useLayerComponents(layers);

  // Memoize connector calculations
  const connectors = useMemo(() => {
    const baseConnectors = layers.reduce((acc: Connector[], layer) => {
      if (layer.parent) {
        const parent = layers.find(l => l.id === layer.parent);
        if (parent) {
          acc.push({
            start: parent.position,
            end: layer.position,
            type: settings.connectors.type,
            parentId: parent.id,
            childId: layer.id
          });
        }
      }
      return acc;
    }, []);

    // Add temporary connector for dragged layer if it has a parent
    if (draggedLayer) {
      const layer = layers.find(l => l.id === draggedLayer);
      if (layer?.parent) {
        const parent = layers.find(l => l.id === layer.parent);
        if (parent) {
          baseConnectors.push({
            start: parent.position,
            end: layer.position,
            type: settings.connectors.type,
            parentId: parent.id,
            childId: layer.id
          });
        }
      }
    }

    return baseConnectors;
  }, [layers, settings.connectors.type, draggedLayer]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY;
    const zoomFactor = delta > 0 ? 0.9 : 1.1; // Smoother zoom
    
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, scale * zoomFactor)
    );

    // Get mouse position relative to canvas
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate new position to zoom towards mouse
    const newPosition = {
      x: mouseX - (mouseX - position.x) * (newScale / scale),
      y: mouseY - (mouseY - position.y) * (newScale / scale)
    };

    updateScale(newScale);
    updatePosition(newPosition);
  }, [scale, position, updateScale, updatePosition]);

  // Update the wheel event listener
  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Handle canvas panning
  useEffect(() => {
    if (!canvasRef.current) return;
    
    let isPanning = false;
    let lastPosition = { x: 0, y: 0 };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        setSpacePressed(true);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = '';
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Start panning with space + left click, middle mouse button, or Alt + left click
      if ((spacePressed && e.button === 0) || e.button === 1 || (e.altKey && e.button === 0)) {
        e.preventDefault();
        isPanning = true;
        setDragging(true);
        lastPosition = { x: e.clientX, y: e.clientY };
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grabbing';
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      
      if (settings.artboard.locked) return;

      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;

      updatePosition({
        x: position.x + deltaX,
        y: position.y + deltaY
      });

      lastPosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning = false;
      setDragging(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = spacePressed ? 'grab' : '';
      }
    };

    const element = canvasRef.current;
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [spacePressed, position, settings.artboard.locked, updatePosition, setDragging, scale, updateScale]);

  // Handle layer dragging
  const handleLayerMouseDown = useCallback((e: React.MouseEvent, layerId: string) => {
    if (e.button !== 0) return; // Only left click
    if (spacePressed) return; // Don't start dragging if in pan mode
    
    e.stopPropagation(); // Prevent canvas drag when clicking layers
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    setDraggedLayer(layerId);
    setDragStart({
      x: e.clientX - (layer.position.x * scale),
      y: e.clientY - (layer.position.y * scale)
    });
  }, [spacePressed, scale, layers]);

  const handleLayerMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedLayer || !dragStart) return;

    const newX = (e.clientX - dragStart.x) / scale;
    const newY = (e.clientY - dragStart.y) / scale;

    updateLayerPosition(draggedLayer, { x: newX, y: newY });
  }, [draggedLayer, dragStart, scale, updateLayerPosition]);

  const handleLayerMouseUp = useCallback(() => {
    setDraggedLayer(null);
    setDragStart(null);
  }, []);

  // Handle layer resizing
  const handleResizeStart = useCallback((layerId: string, handle: 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    setResizingLayer(layerId);
    setResizeHandle(handle);
    setStartResizePoint({ x: e.clientX, y: e.clientY });
    setStartLayerSize(layer.size || { width: 48, height: 48 });
    e.stopPropagation();
  }, [layers]);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!resizingLayer || !startResizePoint || !startLayerSize) return;

    const deltaX = (e.clientX - startResizePoint.x) / scale;
    const deltaY = (e.clientY - startResizePoint.y) / scale;

    let newWidth = startLayerSize.width;
    let newHeight = startLayerSize.height;

    switch (resizeHandle) {
      case 'se':
        newWidth += deltaX;
        newHeight += deltaY;
        break;
      case 'sw':
        newWidth -= deltaX;
        newHeight += deltaY;
        break;
      case 'ne':
        newWidth += deltaX;
        newHeight -= deltaY;
        break;
      case 'nw':
        newWidth -= deltaX;
        newHeight -= deltaY;
        break;
    }

    // Enforce minimum size
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);

    updateLayerSize(resizingLayer, { width: newWidth, height: newHeight });
  }, [resizingLayer, startResizePoint, startLayerSize, scale, resizeHandle, updateLayerSize]);

  const handleResizeEnd = useCallback(() => {
    setResizingLayer(null);
    setResizeHandle(null);
    setStartResizePoint(null);
    setStartLayerSize(null);
  }, []);

  const handleLayerClick = (layer: Layer) => {
    if (layer.type === 'shell_config' || layer.type === 'main_injector' || layer.type === 'function_injector') {
      setSelectedNodeId(layer.id);
    }
  };

  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(MAX_SCALE, scale + SCALE_STEP);
    updateScale(newScale);
  }, [scale, updateScale]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(MIN_SCALE, scale - SCALE_STEP);
    updateScale(newScale);
  }, [scale, updateScale]);

  return (
    <div 
      ref={canvasRef}
      className={`relative flex-1 overflow-hidden canvas-container select-none ${
        settings.artboard.locked ? 'cursor-not-allowed' : ''
      }`}
      style={{
        backgroundColor: settings.background.color
      }}
      onMouseMove={handleResizeMove}
      onMouseUp={handleResizeEnd}
      onMouseLeave={() => {
        handleResizeEnd();
        handleLayerMouseUp();
      }}
    >
      <BackgroundPattern 
        type={settings.pattern.type}
        color={settings.pattern.color}
        tileSize={settings.pattern.size}
        dotSize={settings.pattern.thickness}
        opacity={settings.pattern.opacity}
      />

      <SettingsPanel />

      {/* Render Layers */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${settings.artboard.rotation}deg)`,
          transformOrigin: 'center center'
        }}
        onMouseMove={handleLayerMouseMove}
        onMouseUp={handleLayerMouseUp}
      >
        {layers.map(layer => {
          const LayerComponent = layerComponents[layer.type];
          if (!LayerComponent) return null;

          return (
            <motion.div
              key={layer.id}
              className={`absolute ${
                draggedLayer === layer.id ? 'cursor-grabbing' : 'cursor-grab'
              } ${layer.selected ? 'ring-2 ring-blue-500' : ''}`}
              initial={false}
              animate={{ 
                scale: draggedLayer === layer.id ? 1.02 : 1,
                boxShadow: draggedLayer === layer.id ? '0 8px 16px rgba(0,0,0,0.12)' : 'none'
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              style={{
                left: layer.position.x,
                top: layer.position.y,
                width: layer.size?.width || 140,
                height: layer.size?.height || 80,
                willChange: 'transform',
                opacity: layer.visible ? 1 : 0.5,
                pointerEvents: layer.visible ? 'auto' : 'none'
              }}
              onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
              onClick={() => {
                selectLayer(layer.id);
                handleLayerClick(layer);
              }}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => {
                setHoveredLayer(null);
                handleLayerMouseUp();
              }}
              dragMomentum={false}
              dragElastic={0}
            >
              <LayerComponent {...layer} />
              {/* Resize Handles */}
              {layer.selected && (
                <>
                  <div
                    className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize z-50 shadow-md"
                    onMouseDown={(e) => handleResizeStart(layer.id, 'nw', e)}
                  />
                  <div
                    className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize z-50 shadow-md"
                    onMouseDown={(e) => handleResizeStart(layer.id, 'ne', e)}
                  />
                  <div
                    className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize z-50 shadow-md"
                    onMouseDown={(e) => handleResizeStart(layer.id, 'sw', e)}
                  />
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize z-50 shadow-md"
                    onMouseDown={(e) => handleResizeStart(layer.id, 'se', e)}
                  />
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Tooltip content="Zoom in">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomIn}
            className="p-2 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
          >
            <MagnifyingGlassPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
          </motion.button>
        </Tooltip>
        <Tooltip content="Zoom out">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomOut}
            className="p-2 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
          >
            <MagnifyingGlassMinus className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
          </motion.button>
        </Tooltip>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Render Connectors */}
      <ConnectorGroup
        connectors={connectors}
        settings={settings.connectors}
      />

      {/* Node Editor */}
      <AnimatePresence>
        {selectedNodeId && (
          <NodeEditor
            layerId={selectedNodeId}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </AnimatePresence>

      {/* Layer Editor */}
      <AnimatePresence>
        {editorState && (
          <LayerEditor
            layerId={editorState.layerId}
            position={editorState.position}
            onClose={() => setEditorState(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}