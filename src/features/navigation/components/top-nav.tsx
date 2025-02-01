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
import UniqueBadge from '../../../components/badge';

const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-muted to-primary ${className}`}>
    {children}
  </span>
);

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
    <nav className="h-16 border-b border-default bg-paper flex items-center justify-between relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-gray-100/50 to-gray-50/50 dark:from-gray-900/30 dark:via-gray-800/30 dark:to-gray-900/30 pointer-events-none" />
      
      <div className="flex flex-col relative">
        <div className="flex items-center space-x-3">
          <div className="flex items-baseline">
            <GradientText className="text-2xl tracking-tight">
              shell
            </GradientText>
            <span className="text-2xl font-light text-gray-400 dark:text-gray-500 mx-1">
              /
            </span>
            <GradientText className="text-2xl tracking-tight">
              config
            </GradientText>
            <UniqueBadge 
              text="β" 
              className="ml-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 
                        dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 
                        border-0 font-mono text-xs text-gray-600 dark:text-gray-400" 
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block font-mono tracking-tight opacity-75">
          ~/visual-shell-configuration-tool
        </p>
      </div>

      <div className="flex items-center space-x-2 relative">
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
            className="p-2 rounded-lg transition-all duration-200 hover:bg-subtle active:scale-95"
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
            className="p-2 rounded-lg transition-all duration-200 hover:bg-subtle active:scale-95"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-muted" weight="duotone" />
            ) : (
              <Moon className="w-5 h-5 text-muted" weight="duotone" />
            )}
          </button>
        </Tooltip>
        <Tooltip content="Settings">
          <button 
            className="p-2 rounded-lg transition-all duration-200 hover:bg-subtle active:scale-95"
          >
            <Gear className="w-5 h-5 text-muted" weight="duotone" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};