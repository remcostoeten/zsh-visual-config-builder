import React from 'react';
import { motion } from 'framer-motion';
import type { Point, Connector } from '../../types/canvas';

interface ConnectorProps {
  start: Point;
  end: Point;
  type: 'bezier' | 'orthogonal';
  color?: string;
  thickness?: number;
  animate?: boolean;
}

function calculateBezierPath(start: Point, end: Point): string {
  const midX = (start.x + end.x) / 2;
  const controlPoint1 = { x: midX, y: start.y };
  const controlPoint2 = { x: midX, y: end.y };
  
  return `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;
}

function calculateOrthogonalPath(start: Point, end: Point): string {
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
}

export function Connector({ start, end, type, color = '#4B5563', thickness = 2, animate = true }: ConnectorProps) {
  const path = type === 'bezier' ? calculateBezierPath(start, end) : calculateOrthogonalPath(start, end);

  return (
    <motion.path
      d={path}
      stroke={color || '#4B5563'}
      strokeWidth={thickness}
      fill="none"
      initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      strokeLinecap="round" 
      strokeDasharray={animate ? "8,8" : undefined}
      style={{
        filter: animate ? 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))' : undefined
      }}
      className="pointer-events-none"
    />
  );
}

interface ConnectorGroupProps {
  connectors: Connector[];
  settings: {
    color: string;
    thickness: number;
    animate: boolean;
  };
}

export function ConnectorGroup({ connectors, settings }: ConnectorGroupProps) {
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {connectors.map((connector, index) => (
        <Connector
          key={`${connector.parentId}-${connector.childId}-${index}`}
          start={connector.start}
          end={connector.end}
          type={connector.type}
          color={settings.color}
          thickness={settings.thickness}
          animate={settings.animate}
        />
      ))}
    </svg>
  );
}