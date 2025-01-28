/**
 * @author Remco Stoeten
 * @description Theme context and provider for managing application-wide theming
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, type Theme } from '../config/themes';

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return themes.find(t => t.name === savedTheme) || themes[0];
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme.name);
    applyTheme(currentTheme);
  }, [currentTheme]);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--${key}`, value);
      }
    });
  };

  const setTheme = (themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      setCurrentTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};