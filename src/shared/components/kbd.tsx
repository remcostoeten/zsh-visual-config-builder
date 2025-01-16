import React from 'react';

interface KbdProps {
  children: React.ReactNode;
}

export const Kbd: React.FC<KbdProps> = ({ children }) => {
  return (
    <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
      {children}
    </kbd>
  );
};