import { useState } from 'react';

type ToastState = 'idle' | 'loading' | 'success' | 'error';

interface ToastOptions {
  type: ToastState;
  message?: string;
}

export function useToast() {
  const [state, setState] = useState<ToastState>('idle');

  const showToast = (options: ToastOptions) => {
    setState(options.type);
    if (options.type !== 'loading') {
      setTimeout(() => {
        setState('idle');
      }, 3000);
    }
  };

  return {
    state,
    showToast,
  };
} 