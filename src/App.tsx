import React from 'react';
import { TopNav } from './features/navigation/components/top-nav';
import { Sidebar } from './features/sidebar/components/sidebar';
import { Canvas } from './features/canvas/components/canvas';
import { LayerPanel } from './features/layers/components/layer-panel';
import { ThemeProvider } from './shared/context/theme-context';
import { LayoutProvider } from './shared/context/layout-context';
import { useLayout } from './shared/context/layout-context';

const AppContent = () => {
  const { isSidebarOpen, isSidebarRight } = useLayout();

  return (
    <div className="h-screen flex flex-col dark:bg-[#1A1A1A] bg-white">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {!isSidebarRight && isSidebarOpen && <Sidebar />}
        <Canvas />
        <LayerPanel />
        {isSidebarRight && isSidebarOpen && <Sidebar />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <AppContent />
      </LayoutProvider>
    </ThemeProvider>
  );
}