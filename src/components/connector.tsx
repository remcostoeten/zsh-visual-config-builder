import React from 'react';

interface Props {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export default function Connector({ start, end }: Props) {
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
      }}
    >
      <path
        d={path}
        stroke="rgb(99 102 241)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4"
        className="animate-dash"
      />
    </svg>
  );
}