import { useState, useCallback, useRef, useEffect } from 'react';

export function useToast() {
  const [state, setState] = useState<'initial' | 'loading' | 'success'>('initial');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showToast = useCallback((newState: 'initial' | 'loading' | 'success') => {
    setState(newState);
    
    if (newState === 'loading') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setState('success');
        timeoutRef.current = setTimeout(() => {
          setState('initial');
        }, 2000);
      }, 1500);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    showToast,
  };
}