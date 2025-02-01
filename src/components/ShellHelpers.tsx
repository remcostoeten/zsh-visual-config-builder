import React from 'react';
import { Book, Code } from 'lucide-react';
import { shellSnippets } from '../utils/shell-snippets';

interface Props {
  onInsertSnippet: (code: string) => void;
}

export default function ShellHelpers({ onInsertSnippet }: Props) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredSnippets = selectedCategory === 'all' 
    ? shellSnippets 
    : shellSnippets.filter(s => s.category === selectedCategory);

  return (
    <div className="bg-[#252525] rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Book className="w-4 h-4" />
        <h3 className="font-medium">Shell Helpers</h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2 py-1 rounded text-sm ${
            selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-300'
          }`}
        >
          All
        </button>
        {['variable', 'loop', 'function', 'conditional'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-2 py-1 rounded text-sm capitalize ${
              selectedCategory === category ? 'bg-indigo-600 text-white' : 'text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredSnippets.map(snippet => (
          <button
            key={snippet.id}
            onClick={() => onInsertSnippet(snippet.code)}
            className="w-full text-left p-2 rounded hover:bg-[#333] group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{snippet.name}</span>
              <Code className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-sm text-gray-400">{snippet.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}