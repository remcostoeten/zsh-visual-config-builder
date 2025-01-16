import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export const useKeyboardShortcut = (
  keyCombo: KeyCombo,
  callback: () => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      if (
        event.key.toLowerCase() === keyCombo.key.toLowerCase() &&
        (!keyCombo.ctrlKey || cmdOrCtrl) &&
        (!keyCombo.metaKey || event.metaKey) &&
        (!keyCombo.shiftKey || event.shiftKey)
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, deps);
};