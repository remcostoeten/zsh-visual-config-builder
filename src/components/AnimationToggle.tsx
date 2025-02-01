import React from 'react';
import { Settings2, Zap } from 'lucide-react';
import { AnimationSpeed } from '../types/settings';

interface Props {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  speed: AnimationSpeed;
  onSpeedChange: (speed: AnimationSpeed) => void;
}

export default function AnimationToggle({ isEnabled, onToggle, speed, onSpeedChange }: Props) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#252525] rounded-lg border border-[#333]">
      <div className="flex items-center gap-2">
        <Zap className={`w-4 h-4 ${isEnabled ? 'text-yellow-400' : 'text-gray-500'}`} />
        <span className="text-sm text-gray-300">Animations</span>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>

      {isEnabled && (
        <div className="flex items-center gap-2 ml-2">
          <Settings2 className="w-4 h-4 text-gray-500" />
          <select
            value={speed}
            onChange={(e) => onSpeedChange(e.target.value as AnimationSpeed)}
            className="bg-[#333] text-sm text-gray-300 rounded px-2 py-1 border border-[#444] focus:outline-none focus:border-indigo-500"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      )}
    </div>
  );
}