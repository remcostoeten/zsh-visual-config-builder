import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Grid as GridIcon, Circle, Trash, ArrowBendDoubleUpRight, Square, Scribble, Terminal, ArrowRight, FileCode, Command } from '../../../shared/components/icons';
import { FlowNode } from './flow-node';
import { Tooltip } from '../../../shared/components/tooltip';
import { useCanvas } from '../../../shared/stores/canvas';
import { useLayers } from '../../../shared/stores/layers';
import { SettingsPanel } from '../../settings/components/settings-panel';
import { LayerEditor } from './layer-editor';
import { NodeEditor } from './node-editor';
import { Ruler } from './ruler';
import { ConnectorGroup } from '../../../shared/components/connectors';
import { v4 as uuidv4 } from 'uuid';
import type { Connector, Point } from '../../../shared/types/canvas';
import type { Layer } from '../../../shared/types/layer';

const createLayerComponents = (layers: Layer[]) => {
  const components = {
    'circle': () => <Circle className="w-full h-full text-gray-600 dark:text-gray-400" weight="duotone" />,
    'square': () => <Square className="w-full h-full text-gray-600 dark:text-gray-400" weight="duotone" />,
    'arrow': () => <ArrowRight className="w-full h-full text-gray-600 dark:text-gray-400" weight="duotone" />,
    'scribble': () => <Scribble className="w-full h-full text-gray-600 dark:text-gray-400" weight="duotone" />,
    'zshrc': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<FileCode className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language={layer.language || 'bash'}
        variant="highlight"
        color="blue"
        shape="rectangle"
      />
    ),
    'main': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Terminal className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language={layer.language || 'bash'}
        variant="highlight"
        color="purple"
        shape="rectangle"
      />
    ),
    'aliases': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Command className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language={layer.language || 'bash'}
        variant="highlight"
        color="green"
        shape="rectangle"
      />
    ),
    'git-aliases': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Command className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language={layer.language || 'bash'}
        variant="highlight"
        color="orange"
        shape="rectangle"
      />
    ),
    'dev-aliases': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Command className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language={layer.language || 'bash'}
        variant="highlight"
        color="yellow"
        shape="rectangle"
      />
    ),
    'functions': (layer: Layer) => (
      <FlowNode
        id={layer.id}
        parent={layer.parent}
        icon={<Terminal className="w-6 h-6" weight="duotone" />}
        label={layer.name}
        metadata={layer.metadata}
        fill={layer.style?.color}
        allNodes={layers.map(l => ({
          id: l.id,
          parent: l.parent,
          label: l.name
        }))}
        code={layer.code || ''}
        language={layer.language || 'bash'}
        variant="highlight"
        color="red"
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

const BackgroundPattern = React.memo(({ type, color, tileSize, dotSize }: {
  type: 'dots' | 'grid' | 'tiles' | 'none';
  color: string;
  tileSize: number;
  dotSize: number;
}) => {
  if (type === 'none') return null;
  
  const patternId = useMemo(() => `pattern-${type}-${tileSize}-${dotSize}`, [type, tileSize, dotSize]);

  const patternContent = useMemo(() => {
    if (type === 'dots') {
      return <circle cx={tileSize/2} cy={tileSize/2} r={dotSize} fill={color} />;
    }
    if (type === 'grid') {
      return <path d={`M ${tileSize} 0 L 0 0 0 ${tileSize}`} stroke={color} strokeWidth="1" fill="none" />;
    }
    if (type === 'tiles') {
      return <rect x="0" y="0" width={tileSize} height={tileSize} fill="none" stroke={color} strokeWidth="1" />;
    }
    return null;
  }, [type, color, tileSize, dotSize]);
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" style={{ zIndex: 0 }}>
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
    isDragging,
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

  // Handle canvas panning
  useEffect(() => {
    if (!canvasRef.current) return;
    let lastPosition = { x: 0, y: 0 };
    let isPanning = false;

    // Handle space key for temporary pan mode
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
        isPanning = true;
        setDragging(true);
        lastPosition = { x: e.clientX, y: e.clientY };
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grabbing';
        }
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Handle panning
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

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const scaleChange = delta > 0 ? SCALE_STEP : -SCALE_STEP;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + scaleChange));
        updateScale(newScale);
      }
    };

    const element = canvasRef.current;
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);
    element.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
      element.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [position, scale, spacePressed]);

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

  return (
    <div 
      ref={canvasRef}
      className={`relative flex-1 overflow-hidden bg-gray-50 dark:bg-[#2A2A2A] canvas-container select-none ${
        settings.artboard.locked ? 'cursor-not-allowed' : ''
      }`}
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
        tileSize={settings.pattern.tileSize}
        dotSize={settings.pattern.dotSize}
      />

      <SettingsPanel />

      {/* Render Layers */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0'
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                left: layer.position.x,
                top: layer.position.y,
                width: layer.size?.width || 140,
                height: layer.size?.height || 80,
                opacity: layer.visible ? 1 : 0.5,
                transform: `rotate(${layer.style?.rotation || 0}deg)`,
              }}
              onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
              onClick={() => {
                selectLayer(layer.id);
                if (layer.type.includes('aliases') || layer.type === 'zshrc' || layer.type === 'main' || layer.type === 'functions') {
                  setSelectedNodeId(layer.id);
                }
              }}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => {
                setHoveredLayer(null);
                handleLayerMouseUp();
              }}
            >
              <LayerComponent {...layer} />
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
            onClick={() => updateScale(Math.min(MAX_SCALE, scale + SCALE_STEP))}
            className="p-2 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg"
          >
            <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
          </motion.button>
        </Tooltip>
        <Tooltip content="Zoom out">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateScale(Math.max(MIN_SCALE, scale - SCALE_STEP))}
            className="p-2 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-lg"
          >
            <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
          </motion.button>
        </Tooltip>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
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