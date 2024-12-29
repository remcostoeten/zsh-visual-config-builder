import React from 'react';
import { Heart, Coffee, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333] px-4 py-2 z-40">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://github.com/remcostoeten"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            @remcostoeten
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.buymeacoffee.com/remcostoeten"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFE333] text-[#000000] px-3 py-1 rounded-md transition-all duration-200"
          >
            <Coffee className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Buy me a coffee</span>
          </a>
          <a
            href="https://github.com/remcostoeten/hgg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}