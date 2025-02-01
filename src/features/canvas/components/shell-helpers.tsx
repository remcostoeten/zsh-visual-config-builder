import React from 'react';
import {
  Book,
  Code,
  FileCode,
  GitFork,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { shellSnippets } from '../../../utils/shell-snippets';
import { devTemplate, dockerTemplate } from '../../../config/templates';
import { useCanvasStore } from '../canvas-slice';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';

interface Props {
  onInsertSnippet: (code: string) => void;
}

type Tab = 'snippets' | 'templates';

const categoryDescriptions = {
  all: 'View all available shell snippets',
  variable: 'Variable declarations and array operations',
  loop: 'Different types of loops (for, while, until)',
  function: 'Function declarations and usage patterns',
  conditional: 'If statements and case expressions',
  export: 'Environment variable exports',
  alias: 'Command aliases and shortcuts',
};

export default function ShellHelpers({ onInsertSnippet }: Props) {
  const [activeTab, setActiveTab] = React.useState<Tab>('snippets');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const setConfig = useCanvasStore((state) => state.setConfig);

  const categories = [
    'all',
    'variable',
    'loop',
    'function',
    'conditional',
    'export',
    'alias',
  ];
  const filteredSnippets =
    selectedCategory === 'all'
      ? shellSnippets
      : shellSnippets.filter((s) => s.category === selectedCategory);

  const InfoTooltip = ({ content }: { content: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs p-3 text-xs">
        <p className="text-gray-300">{content}</p>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-[#252525] rounded-lg flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#333] px-2">
        <button
          onClick={() => setActiveTab('snippets')}
          className={`flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'snippets'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Snippets
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition-colors ${
            activeTab === 'templates'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Templates
        </button>
      </div>

      {activeTab === 'snippets' ? (
        <div className="flex flex-col h-full">
          {/* Categories */}
          <div className="p-4 border-b border-[#333]">
            <div className="flex items-center gap-2 mb-3 text-white">
              <Book className="w-4 h-4" />
              <h3 className="font-medium">Shell Helpers</h3>
              <InfoTooltip content="Browse and insert common shell script patterns and functions" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {categories.map((category) => (
                <div key={category} className="relative group">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#333]'
                    }`}
                  >
                    {category}
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-[#1E1E1E] text-xs text-gray-300 px-2 py-1 rounded whitespace-nowrap border border-[#333]">
                      {
                        categoryDescriptions[
                          category as keyof typeof categoryDescriptions
                        ]
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Snippets */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSnippets.map((snippet, index) => (
              <React.Fragment key={snippet.id}>
                <button
                  onClick={() => onInsertSnippet(snippet.code)}
                  className="w-full text-left p-2 rounded hover:bg-[#333] group transition-colors relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">
                      {snippet.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <InfoTooltip content={snippet.description} />
                      <Code className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {snippet.description}
                  </p>
                </button>
                {index < filteredSnippets.length - 1 && (
                  <div className="h-px bg-[#333] mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <FileCode className="w-4 h-4" />
            <h3 className="font-medium">Config Templates</h3>
            <InfoTooltip content="Pre-configured ZSH setups for different use cases" />
          </div>

          <button
            onClick={() => setConfig(devTemplate)}
            className="w-full p-3 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-colors group border border-[#333] text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white font-medium">
                Developer Setup
              </span>
              <div className="flex items-center gap-2">
                <InfoTooltip content="Complete development environment with Git, Docker, and Node.js configurations" />
                <GitFork className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Complete development environment with Git, Docker, and Node.js
              configurations
            </p>
          </button>

          <div className="h-px bg-[#333] mx-1" />

          <button
            onClick={() => setConfig(dockerTemplate)}
            className="w-full p-3 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-colors group border border-[#333] text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white font-medium">
                Docker template{' '}
              </span>
              <div className="flex items-center gap-2">
                <InfoTooltip content="Optimize your local docker experience" />
                <GitFork className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              A boilerplate setup specialized in improving your local docker
              workflow.
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
