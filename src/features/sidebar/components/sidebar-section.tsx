import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from '../../../shared/components/icons';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <button
        className={`w-full px-3 py-1.5 flex items-center justify-between ${
          !isExpanded ? 'bg-gray-100 dark:bg-[#2A2A2A]' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="py-0.5">{children}</div>}
    </div>
  );
};