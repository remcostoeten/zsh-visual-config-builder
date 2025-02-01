export interface ToastProps {
  state: 'loading' | 'success' | 'error' | 'idle';
  onReset: () => void;
  onSave: () => void;
  onDismiss: () => void;
}

export function Toast({ state, onReset, onSave, onDismiss }: ToastProps) {
  // ... component implementation
} 