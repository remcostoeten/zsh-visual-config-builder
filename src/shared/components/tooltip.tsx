import React, { useState, useEffect, useRef } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!tooltipRef.current || !containerRef.current) return;
      
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Check if tooltip would go off-screen in its current position
      const spaceAbove = containerRect.top;
      const spaceBelow = windowHeight - containerRect.bottom;
      const spaceLeft = containerRect.left;
      const spaceRight = windowWidth - containerRect.right;

      // Add padding to ensure tooltip doesn't touch screen edges
      const padding = 8;

      // Determine best position with padding consideration
      if (spaceAbove >= tooltipRect.height + padding) {
        setPosition('top');
      } else if (spaceBelow >= tooltipRect.height + padding) {
        setPosition('bottom');
      } else if (spaceRight >= tooltipRect.width + padding) {
        setPosition('right');
      } else if (spaceLeft >= tooltipRect.width + padding) {
        setPosition('left');
      } else {
        // Default to top if no good position is found
        setPosition('top');
      }
    };

    const observer = new ResizeObserver(updatePosition);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  return (
    <div ref={containerRef} className="relative group">
      {children}
      <div
        ref={tooltipRef}
        className={`
          fixed z-50 px-2.5 py-1.5 text-xs font-medium
          text-white bg-gray-900/95 dark:bg-gray-800/95
          rounded-md shadow-lg backdrop-blur-sm
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          whitespace-nowrap pointer-events-none
          ${getPositionClasses()}
        `}
        style={{
          maxWidth: 'calc(100vw - 16px)',
          maxHeight: 'calc(100vh - 16px)'
        }}
      >
        {content}
        <div 
          className={`
            absolute w-2 h-2 bg-gray-900/95 dark:bg-gray-800/95
            transform rotate-45
            ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
              'left-[-4px] top-1/2 -translate-y-1/2'}
          `}
        />
      </div>
    </div>
  );
};