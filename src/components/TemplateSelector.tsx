import React from 'react';
import { Plus } from 'lucide-react';
import { getTemplateList, createFromTemplate } from '../templates/hierarchy-templates';

interface Props {
  onSelect: (config: ReturnType<typeof createFromTemplate>) => void;
}

export function TemplateSelector({ onSelect }: Props) {
  const templates = getTemplateList();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <div className="bg-white rounded-lg shadow-xl p-4 w-64">
        <h3 className="text-lg font-medium mb-4">Start with Template</h3>
        <div className="space-y-2">
          {templates.map(({ key, title }) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(createFromTemplate(key))}
              className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-indigo-50 rounded-lg group transition-colors"
            >
              <Plus className="w-4 h-4 text-indigo-500" />
              <div>
                <div className="font-medium text-gray-800">{title}</div>
                <div className="text-xs text-gray-500">
                  {key === 'basic' ? 'Simple ZSH setup with aliases' : 'Full development environment'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 