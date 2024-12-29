import { type ReactNode, createContext, useContext, useState, useCallback } from "react";
import type { ConnectorSettings } from "../../types/settings";

const defaultSettings: ConnectorSettings = {
  connectorColor: '#6366f1',
  animationSpeed: 1000,
  dashLength: 4,
  lineWidth: 1.5,
  useShebang: true,
  shebangType: 'zsh',
  defaultShebang: true
};

interface SettingsContextType {
  settings: ConnectorSettings;
  updateSettings: (updates: Partial<ConnectorSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function SettingsProvider({ children }: Props) {
  const [settings, setSettings] = useState<ConnectorSettings>(defaultSettings);

  const updateSettings = useCallback((updates: Partial<ConnectorSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
} 