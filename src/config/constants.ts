// UI Constants
export const UI = {
  TOAST: {
    POSITION: {
      BOTTOM: 24, // Distance from bottom in rem
      LEFT: '50%',
      TRANSFORM: '-50%'
    },
    ANIMATION: {
      DURATION: 200,
      SPRING: {
        STIFFNESS: 500,
        DAMPING: 30,
        MASS: 1
      }
    }
  },
  CANVAS: {
    HEIGHT: 600,
    MARGIN_TOP: 4,
    NODE: {
      WIDTH: 280,
      SPACING: 300
    }
  },
  ANIMATIONS: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500
    }
  }
} as const;

// Layout Constants
export const LAYOUT = {
  MAX_WIDTH: 1200,
  PADDING: {
    X: 8,
    Y: 8
  }
} as const;

// Theme Constants
export const THEME = {
  COLORS: {
    BACKGROUND: '#1A1A1A',
    SURFACE: '#1E1E1E',
    SURFACE_LIGHTER: '#252525',
    BORDER: '#333333',
    PRIMARY: {
      DEFAULT: '#6366f1',
      HOVER: '#4f46e5',
      GRADIENT: {
        FROM: '#7c5aff',
        TO: '#6c47ff',
        HOVER: {
          FROM: '#8f71ff',
          TO: '#7c5aff'
        },
        ACTIVE: {
          FROM: '#6c47ff',
          TO: '#5835ff'
        }
      }
    }
  },
  SHADOWS: {
    TOAST: [
      '0px 32px 64px -16px rgba(0,0,0,0.30)',
      '0px 16px 32px -8px rgba(0,0,0,0.30)',
      '0px 8px 16px -4px rgba(0,0,0,0.24)',
      '0px 4px 8px -2px rgba(0,0,0,0.24)',
      '0px -8px 16px -1px rgba(0,0,0,0.16)',
      '0px 2px 4px -1px rgba(0,0,0,0.24)',
      '0px 0px 0px 1px rgba(0,0,0,1.00)',
      'inset 0px 0px 0px 1px rgba(255,255,255,0.08)',
      'inset 0px 1px 0px 0px rgba(255,255,255,0.20)'
    ].join(',')
  }
} as const;

// Feature Flags
export const FEATURES = {
  SHOW_ROADMAP: true,
  ENABLE_KEYBOARD_SHORTCUTS: true,
  ENABLE_ANIMATIONS: true,
  ENABLE_DARK_MODE: true
} as const;

// Keyboard Shortcuts
export const SHORTCUTS = {
  SAVE: ['ctrl+s', 'meta+s', 'alt+s'],
  UNDO: ['ctrl+z', 'meta+z'],
  REDO: ['ctrl+shift+z', 'meta+shift+z'],
  NEW_NODE: ['ctrl+n', 'meta+n'],
  DELETE_NODE: ['delete', 'backspace'],
  TOGGLE_ZEN_MODE: ['ctrl+shift+z', 'meta+shift+z']
} as const;

// Storage Keys
export const STORAGE = {
  CONFIG: 'zsh-config-builder',
  SETTINGS: 'zsh-config-settings',
  THEME: 'zsh-config-theme'
} as const;