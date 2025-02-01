import { X, Plus, Save, RotateCcw, Minimize2 } from 'lucide-react';
import { useCanvasStore } from '../features/canvas/canvas-slice';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function ZenModeToolbar() {
  const { 
    setIsZenMode, 
    addNode,
    saveConfig,
    hasUnsavedChanges,
    handleReset 
  } = useCanvasStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#252525] rounded-lg border border-[#333] shadow-lg">
      <div className="flex items-center gap-2 p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Plus className="w-4 h-4" />
              <span className="ml-2">Add Node</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid gap-1">
              <button
                onClick={() => addNode('injector')}
                className="text-sm px-2 py-1.5 text-left hover:bg-white/[0.06] rounded"
              >
                Add Injector
              </button>
              <button
                onClick={() => addNode('partial')}
                className="text-sm px-2 py-1.5 text-left hover:bg-white/[0.06] rounded"
              >
                Add Partial
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {hasUnsavedChanges && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={saveConfig}
            >
              <Save className="w-4 h-4" />
              <span className="ml-2">Save</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="ml-2">Reset</span>
            </Button>
          </>
        )}

        <div className="h-4 w-px bg-white/10" />

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => setIsZenMode(false)}
        >
          <Minimize2 className="w-4 h-4" />
          <span className="ml-2">Exit Zen Mode</span>
        </Button>
      </div>
    </div>
  );
} 