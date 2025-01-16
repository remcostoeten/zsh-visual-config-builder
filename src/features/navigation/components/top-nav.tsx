import React from 'react';
import {
  Gear,
  Moon,
  Sun,
  PanelLeft,
  PanelRight,
  PanelLeftClose,
  PanelRightClose,
} from '../../../shared/components/icons';
import { useTheme } from '../../../shared/context/theme-context';
import { useLayout } from '../../../shared/context/layout-context';
import { useKeyboardShortcut } from '../../../shared/hooks/useKeyboardShortcut';
import { Tooltip } from '../../../shared/components/tooltip';
import { Kbd } from '../../../shared/components/kbd';

export const TopNav: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    isSidebarOpen,
    isSidebarRight,
    toggleSidebar,
    toggleSidebarPosition,
  } = useLayout();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  useKeyboardShortcut({ key: 'b', ctrlKey: true }, toggleSidebar);
  useKeyboardShortcut(
    { key: 'b', ctrlKey: true, shiftKey: true },
    toggleSidebarPosition
  );

  return (
    <nav className="h-16 border-b border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] px-6 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Shell Config Builder
          <UniqueBadge text="Beta" className="ml-2" />

        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
          Visual configuration builder for your shell environment
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Tooltip
          content={
            <div className="flex items-center space-x-1">
              <span>{isSidebarOpen ? 'Hide' : 'Show'} sidebar</span>
              <Kbd>{modKey} + B</Kbd>
            </div>
          }
        >
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              isSidebarRight ? (
                <PanelRightClose className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
              )
            ) : isSidebarRight ? (
              <PanelRight className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" style={{ transform: 'scaleX(-1)' }} />
            ) : (
              <PanelLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
            )}
          </button>
        </Tooltip>
        <Tooltip
          content={
            <div className="flex items-center space-x-1">
              <span>Move sidebar to {isSidebarRight ? 'left' : 'right'}</span>
              <Kbd>{modKey} + Shift + B</Kbd>
            </div>
          }
        >
          <button
            onClick={toggleSidebarPosition}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            {isSidebarRight ? (
              <PanelLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
            ) : (
              <PanelRight className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" style={{ transform: 'scaleX(-1)' }} />
            )}
          </button>
        </Tooltip>
        <Tooltip content="Toggle theme">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" weight="duotone" />
            )}
          </button>
        </Tooltip>
        <Tooltip content="Settings">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors">
            <Gear className="w-5 h-5 text-gray-600 dark:text-gray-400" weight="duotone" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};