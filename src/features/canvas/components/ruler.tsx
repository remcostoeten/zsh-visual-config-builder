import React from 'react';

interface RulerProps {
  orientation: 'horizontal' | 'vertical';
  scale: number;
  position: { x: number; y: number };
  containerSize: { width: number; height: number };
}

export function Ruler({ orientation, scale, position, containerSize }: RulerProps) {
  const rulerSize = 20; // Width/height of ruler
  const majorTickInterval = 100; // Pixels between major ticks
  const minorTickInterval = 20; // Pixels between minor ticks

  const getTickPositions = () => {
    const length = orientation === 'horizontal' ? containerSize.width : containerSize.height;
    const offset = orientation === 'horizontal' ? position.x : position.y;
    const ticks = [];
    
    const start = Math.floor((-offset / scale) / minorTickInterval) * minorTickInterval;
    const end = start + (length / scale) + minorTickInterval;
    
    for (let i = start; i <= end; i += minorTickInterval) {
      const isMajor = i % majorTickInterval === 0;
      ticks.push({ position: i, isMajor });
    }
    
    return ticks;
  };

  return (
    <div
      className="absolute bg-white dark:bg-[#1A1A1A] z-10"
      style={{
        ...(orientation === 'horizontal'
          ? {
              top: 0,
              left: rulerSize,
              right: 0,
              height: rulerSize,
            }
          : {
              top: rulerSize,
              left: 0,
              bottom: 0,
              width: rulerSize,
            }),
      }}
    >
      <svg
        width={orientation === 'horizontal' ? '100%' : rulerSize}
        height={orientation === 'horizontal' ? rulerSize : '100%'}
        className="absolute"
      >
        {getTickPositions().map(({ position, isMajor }) => {
          // Calculate the scaled and offset position
          const scaledPosition = position * scale + (orientation === 'horizontal' ? position.x : position.y);
          
          // Ensure coordinates are valid numbers
          const x1 = orientation === 'horizontal' ? scaledPosition : (isMajor ? 0 : 10);
          const y1 = orientation === 'horizontal' ? (isMajor ? 0 : 10) : scaledPosition;
          const x2 = orientation === 'horizontal' ? scaledPosition : rulerSize;
          const y2 = orientation === 'horizontal' ? rulerSize : scaledPosition;
          
          // Only render if all coordinates are valid numbers
          if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            return null;
          }

          return (
            <React.Fragment key={position}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-gray-300 dark:text-gray-700"
                strokeWidth={1}
              />
              {isMajor && (
                <text
                  x={orientation === 'horizontal' ? scaledPosition : 14}
                  y={orientation === 'horizontal' ? 14 : scaledPosition}
                  textAnchor={orientation === 'horizontal' ? 'middle' : 'end'}
                  alignmentBaseline="middle"
                  className="text-[10px] fill-gray-500 dark:fill-gray-400"
                >
                  {position}
                </text>
              )}
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
}