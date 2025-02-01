import React from 'react';
import { ConnectorSettings } from '@/types/settings';

interface Props {
  start: { x: number; y: number };
  end: { x: number; y: number };
  settings: ConnectorSettings;
}

export default function AnimatedConnector({ start, end, settings }: Props) {
  const path = `M ${start.x} ${start.y} C ${start.x} ${(start.y + end.y) / 2}, ${end.x} ${(start.y + end.y) / 2}, ${end.x} ${end.y}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <path
        d={path}
        stroke={settings.connectorColor}
        strokeWidth={settings.lineWidth}
        fill="none"
        strokeDasharray={settings.dashLength}
        style={{
          animation: `dash ${settings.animationSpeed}ms linear infinite`,
        }}
        className="opacity-60"
      />
    </svg>
  );
}