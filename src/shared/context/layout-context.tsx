import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  isSidebarOpen: boolean;
  isSidebarRight: boolean;
  toggleSidebar: () => void;
  toggleSidebarPosition: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRight, setIsSidebarRight] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleSidebarPosition = () => setIsSidebarRight(prev => !prev);

  return (
    <LayoutContext.Provider value={{ 
      isSidebarOpen, 
      isSidebarRight, 
      toggleSidebar, 
      toggleSidebarPosition 
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};