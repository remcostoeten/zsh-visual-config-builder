import React from 'react';
import {
  SplitSquareHorizontal,
  FileCode,
  GitFork,
  Settings2,
  Info,
} from 'lucide-react';
import { devTemplate, dockerTemplate } from '../config/templates';
import { ConfigNode } from '../types/config';
import { useToast } from '../hooks/useToast';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

interface Props {
  onTemplateSelect: (template: ConfigNode) => void;
  onSaveConfig: () => void;
  onLoadConfig: () => void;
  currentConfig: ConfigNode;
}

export default function Introduction({
  onTemplateSelect,
  onSaveConfig,
  onLoadConfig,
  currentConfig,
}: Props) {
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const { state, showToast } = useToast();

  const handleTemplateSelect = (template: ConfigNode) => {
    if (currentConfig.children && currentConfig.children.length > 0) {
      if (
        window.confirm(
          'This will overwrite your current configuration. Would you like to save it first?'
        )
      ) {
        onSaveConfig();
      }
    }
    onTemplateSelect(template);
    showToast('success');
  };

  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <button
          onClick={() => handleTemplateSelect(devTemplate)}
          className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg p-3 text-left transition-colors"
        >
          <h3 className="text-indigo-400 font-medium">Developer Template</h3>
          <p className="text-sm text-gray-400">
            Git, Docker, Node.js configuration
          </p>
        </button>
        <button
          onClick={() => handleTemplateSelect(dockerTemplate)}
          className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg p-3 text-left transition-colors"
        >
          <h3 className="text-emerald-400 font-medium">Docker Template</h3>
          <p className="text-sm text-gray-400">
            Server management & monitoring
          </p>
        </button>
        <div className="flex items-center gap-1 bg-[#252525] rounded-lg p-1 border border-[#333]">
          <button
            onClick={onSaveConfig}
            className="h-8 px-3 rounded-md text-[13px] text-gray-300 hover:bg-white/[0.08] transition-colors flex items-center gap-2 group"
          >
            <Settings2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            Save
          </button>
          <button
            onClick={onLoadConfig}
            className="h-8 px-3 rounded-md text-[13px] text-gray-300 hover:bg-white/[0.08] transition-colors flex items-center gap-2 group"
          >
            <Settings2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            Load
          </button>
        </div>
        <button
          onClick={() => setShowAboutModal(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg bg-gray-700/50 hover:bg-gray-700"
          title="About"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent>
          <DialogTitle>About ZSH Config Builder</DialogTitle>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
              <div className="text-indigo-400 mb-2">
                <SplitSquareHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">
                Split Config
              </h3>
              <p className="text-xs text-gray-400">Organize ZSH into modules</p>
            </div>
            <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
              <div className="text-indigo-400 mb-2">
                <FileCode className="w-4 h-4" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">
                Visual Editor
              </h3>
              <p className="text-xs text-gray-400">
                Syntax highlighting & validation
              </p>
            </div>
            <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
              <div className="text-indigo-400 mb-2">
                <GitFork className="w-4 h-4" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">
                Dependencies
              </h3>
              <p className="text-xs text-gray-400">
                Visualize config structure
              </p>
            </div>
            <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
              <div className="text-indigo-400 mb-2">
                <Settings2 className="w-4 h-4" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">
                Shell Helpers
              </h3>
              <p className="text-xs text-gray-400">
                Common patterns & snippets
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
