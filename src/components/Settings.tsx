import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { ConnectorSettings } from '../types/settings';
import ColorPicker from './ColorPicker';
import AnimationToggle from './AnimationToggle';

interface Props {
  settings: ConnectorSettings;
  onSettingsChange: (settings: ConnectorSettings) => void;
}

export default function Settings({ settings, onSettingsChange }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#252525] rounded-lg transition-colors animate-hover hover-lift"
      >
        <SettingsIcon className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333] z-50 animate-scaleIn">
          <div className="flex items-center justify-between p-3 border-b border-[#333]">
            <h3 className="text-white font-medium">Settings</h3>
            <button onClick={() => setIsOpen(false)} className="hover-lift">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            <AnimationToggle
              isEnabled={settings.animations.enabled}
              onToggle={(enabled) => onSettingsChange({
                ...settings,
                animations: { ...settings.animations, enabled }
              })}
              speed={settings.animations.speed}
              onSpeedChange={(speed) => onSettingsChange({
                ...settings,
                animations: { ...settings.animations, speed }
              })}
            />

            {/* Existing settings... */}
          </div>
        </div>
      )}
    </div>
  );
}