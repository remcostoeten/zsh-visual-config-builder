import React from 'react';
import { Search, Terminal, FileCode, Command, ArrowRight, Circle, Square, Scribble } from '../../../shared/components/icons';
import { SidebarSection } from './SidebarSection';
import { motion } from 'framer-motion';
import { useFavorites } from '../../../shared/stores/favorites';
import { useLayers } from '../../../shared/stores/layers';
import { v4 as uuidv4 } from 'uuid';
import type { Point } from '../../../shared/types/canvas';

const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function FavoriteButton({ id, isFavorite, onToggle }: { 
  id: string; 
  isFavorite: boolean; 
  onToggle: (id: string) => void;
}) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(id);
      }}
      className="ml-auto flex-shrink-0 relative w-5 h-5"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className={`absolute inset-0 ${
          isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'
        }`}
        initial={false}
        animate={{
          scale: isFavorite ? [1, 1.2, 1] : 1,
          rotate: isFavorite ? [0, 15, -15, 0] : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
          times: [0, 0.2, 0.8, 1]
        }}
      >
        <motion.path
          d={starPath}
          fill="currentColor"
          initial={false}
          animate={{
            scale: isFavorite ? [1, 0.8, 1.1, 1] : 1,
            opacity: isFavorite ? 1 : 0.5
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut"
          }}
        />
        {isFavorite && (
          <motion.path
            d={starPath}
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 0.8, 1]
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
          />
        )}
      </motion.svg>
    </motion.button>
  );
}

const sidebarItems = {
  inputs: [
    { 
      id: 'zshrc',
      icon: FileCode,
      title: '.zshrc', 
      description: 'Main ZSH configuration file',
      metadata: 'ZSH Config',
      code: '# Main ZSH configuration\nsource ~/main.sh\n',
      language: 'bash'
    },
    { 
      id: 'main',
      icon: Terminal,
      title: 'main.sh',
      description: 'Core shell configuration',
      metadata: 'Main Config',
      code: '# Core shell configuration\nsource ~/aliases.sh\nsource ~/functions.sh\n',
      language: 'bash'
    },
    {
      id: 'aliases',
      icon: Command,
      title: 'aliases.sh',
      description: 'Shell aliases configuration',
      metadata: 'Aliases',
      code: '# Shell aliases\nsource ~/git-aliases.sh\nsource ~/dev-aliases.sh\n',
      language: 'bash'
    },
    {
      id: 'git-aliases',
      icon: Command,
      title: 'git-aliases.sh',
      description: 'Git-specific aliases',
      metadata: 'Git Aliases',
      code: '# Git aliases\nalias gs="git status"\nalias gc="git commit"\nalias gp="git push"\n',
      language: 'bash'
    },
    {
      id: 'dev-aliases',
      icon: Command,
      title: 'dev-aliases.sh',
      description: 'Development aliases',
      metadata: 'Dev Aliases',
      code: '# Development aliases\nalias dc="docker-compose"\nalias k="kubectl"\n',
      language: 'bash'
    },
    {
      id: 'functions',
      icon: Terminal,
      title: 'functions.sh',
      description: 'Shell functions',
      metadata: 'Functions',
      code: '# Shell functions\nfunction mkcd() {\n  mkdir -p "$1" && cd "$1"\n}\n',
      language: 'bash'
    }
  ],
  drawings: [
    { id: 'arrow', icon: ArrowRight, title: 'Arrow', description: 'Add directional arrow' },
    { id: 'circle', icon: Circle, title: 'Circle', description: 'Add circle shape' },
    { id: 'square', icon: Square, title: 'Square', description: 'Add square shape' },
    { id: 'scribble', icon: Scribble, title: 'Hand-drawn Arrow', description: 'Add hand-drawn arrow' },
  ]
};

export function Sidebar() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addLayer } = useLayers();
  const [activeTab, setActiveTab] = React.useState<'inputs' | 'drawings'>('inputs');

  const createLayer = (item: any, position?: Point) => {
    const id = uuidv4();
    const canvasElement = document.querySelector('.canvas-container');
    let layerPosition = position;

    if (!layerPosition && canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      layerPosition = {
        x: (rect.width / 2) - 70, // Half of typical layer width
        y: (rect.height / 2) - 40  // Half of typical layer height
      };
    }

    const layer = {
      id,
      type: item.id,
      name: item.title,
      visible: true,
      selected: false,
      position: layerPosition || { x: 0, y: 0 },
      component: null,
      metadata: item.metadata,
      code: item.code,
      language: item.language,
      size: { 
        width: item.id === 'arrow' || item.id === 'circle' || item.id === 'square' || item.id === 'scribble' ? 48 : 140,
        height: item.id === 'arrow' || item.id === 'circle' || item.id === 'square' || item.id === 'scribble' ? 48 : 80
      }
    };
    addLayer(layer);
  };

  const handleDragStart = (item: any) => {
    createLayer(item);
  };

  const handleDoubleClick = (item: any) => {
    createLayer(item);
  };

  return (
    <div className="w-80 border-r border-default bg-paper h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" weight="duotone" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-[#2A2A2A] dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="px-3 border-b border-gray-200 dark:border-[#2A2A2A]">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'inputs'
                ? 'border-blue-500 text-blue-600 dark:border-purple-500 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('drawings')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'drawings'
                ? 'border-blue-500 text-blue-600 dark:border-purple-500 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Drawings & Indicators
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarSection title="Favourites">
          {favorites.length === 0 ? (
            <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <motion.svg 
                viewBox="0 0 24 24" 
                className="w-3.5 h-3.5 mr-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <path d={starPath} fill="currentColor" />
              </motion.svg>
              No favourites yet
            </div>
          ) : (
            favorites.map(id => {
              const item = [...sidebarItems.inputs, ...sidebarItems.drawings].find(i => i.id === id);
              if (!item) return null;
              return (
                <div
                  key={item.id}
                  className="group px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] cursor-move"
                  onDoubleClick={() => handleDoubleClick(item)}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" weight="duotone" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-900 dark:text-white font-medium">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </div>
                    </div>
                    <FavoriteButton
                      id={item.id}
                      isFavorite={true}
                      onToggle={toggleFavorite}
                    />
                  </div>
                </div>
              );
            })
          )}
        </SidebarSection>

        {activeTab === 'inputs' && (
          <SidebarSection title="Inputs">
            {sidebarItems.inputs.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  className="group px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] cursor-move"
                  onDoubleClick={() => handleDoubleClick(item)}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" weight="duotone" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-900 dark:text-white font-medium">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </div>
                    </div>
                    <FavoriteButton
                      id={item.id}
                      isFavorite={favorites.includes(item.id)}
                      onToggle={toggleFavorite}
                    />
                  </div>
                </div>
                {index < sidebarItems.inputs.length - 1 && (
                  <div className="mx-3 border-t border-gray-100 dark:border-[#2A2A2A] opacity-40" />
                )}
              </React.Fragment>
            ))}
          </SidebarSection>
        )}

        {activeTab === 'drawings' && (
          <SidebarSection title="Shapes & Indicators">
            {sidebarItems.drawings.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  className="group px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] cursor-move"
                  onDoubleClick={() => handleDoubleClick(item)}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" weight="duotone" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-900 dark:text-white font-medium">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </div>
                    </div>
                    <FavoriteButton
                      id={item.id}
                      isFavorite={favorites.includes(item.id)}
                      onToggle={toggleFavorite}
                    />
                  </div>
                </div>
                {index < sidebarItems.drawings.length - 1 && (
                  <div className="mx-3 border-t border-gray-100 dark:border-[#2A2A2A] opacity-40" />
                )}
              </React.Fragment>
            ))}
          </SidebarSection>
        )}
      </div>
    </div>
  );
}