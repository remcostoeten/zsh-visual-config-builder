/**
 * @author Remco Stoeten
 * @description Theme configuration for the entire application
 */

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    default: string;
    paper: string;
    subtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    default: string;
    subtle: string;
  };
  node: {
    background: string;
    border: string;
    text: string;
  };
  canvas: {
    background: string;
    grid: string;
  };
  button: {
    primary: string;
    secondary: string;
    hover: string;
    disabled: string;
    text: string;
  };
  input: {
    background: string;
    border: string;
    focus: string;
    placeholder: string;
  };
  sidebar: {
    background: string;
    border: string;
    hover: string;
  };
  tooltip: {
    background: string;
    text: string;
  };
  scrollbar: {
    thumb: string;
    track: string;
  };
  selection: {
    background: string;
    text: string;
  };
  modal: {
    overlay: string;
    background: string;
  };
  code: {
    background: string;
    text: string;
    comment: string;
    keyword: string;
    string: string;
    function: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
};

export type Theme = {
  name: string;
  label: string;
  colors: ThemeColors;
  author?: string;
  description?: string;
  dark?: ThemeColors;
};

export const themes: Theme[] = [
  {
    name: 'system',
    label: 'System Default',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: {
        default: '#ffffff',
        paper: '#f9fafb',
        subtle: '#f3f4f6',
      },
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#6b7280',
      },
      border: {
        default: '#e5e7eb',
        subtle: '#f3f4f6',
      },
      node: {
        background: '#ffffff',
        border: '#e5e7eb',
        text: '#111827',
      },
      canvas: {
        background: '#f9fafb',
        grid: '#e5e7eb',
      },
      button: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        hover: '#2563eb',
        disabled: '#9ca3af',
        text: '#ffffff',
      },
      input: {
        background: '#ffffff',
        border: '#e5e7eb',
        focus: '#3b82f6',
        placeholder: '#9ca3af',
      },
    },
  },
  {
    name: 'catppuccin-mocha',
    label: 'Catppuccin Mocha',
    author: 'Catppuccin',
    description: 'Soothing pastel theme for the high-spirited!',
    colors: {
      primary: '#89b4fa',
      secondary: '#cba6f7',
      accent: '#f5c2e7',
      background: {
        default: '#1e1e2e',
        paper: '#181825',
        subtle: '#313244',
      },
      text: {
        primary: '#cdd6f4',
        secondary: '#bac2de',
        muted: '#a6adc8',
      },
      border: {
        default: '#313244',
        subtle: '#45475a',
      },
      node: {
        background: '#1e1e2e',
        border: '#313244',
        text: '#cdd6f4',
      },
      canvas: {
        background: '#181825',
        grid: '#313244',
      },
      button: {
        primary: '#89b4fa',
        secondary: '#cba6f7',
        hover: '#a5b4fc',
        disabled: '#a5b4fc',
        text: '#ffffff',
      },
      input: {
        background: '#1e1e2e',
        border: '#313244',
        focus: '#89b4fa',
        placeholder: '#a6adc8',
      },
    },
  },
  {
    name: 'monochrome',
    label: 'Monochrome',
    description: 'A refined monochromatic color scheme',
    colors: {
      primary: '#1a1a1a',
      secondary: '#2a2a2a',
      accent: '#404040',
      background: {
        default: '#ffffff',
        paper: '#fafafa',
        subtle: '#f5f5f5',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#404040',
        muted: '#666666',
      },
      border: {
        default: '#e0e0e0',
        subtle: '#f0f0f0',
      },
      node: {
        background: '#ffffff',
        border: '#e0e0e0',
        text: '#1a1a1a',
      },
      canvas: {
        background: '#fafafa',
        grid: '#e5e5e5',
      },
      button: {
        primary: '#1a1a1a',
        secondary: '#2a2a2a',
        hover: '#404040',
        disabled: '#a0a0a0',
        text: '#ffffff',
      },
      input: {
        background: '#ffffff',
        border: '#e0e0e0',
        focus: '#1a1a1a',
        placeholder: '#a0a0a0',
      },
    },
    dark: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      accent: '#c0c0c0',
      background: {
        default: '#141414',
        paper: '#1a1a1a',
        subtle: '#202020',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        muted: '#a0a0a0',
      },
      border: {
        default: '#2a2a2a',
        subtle: '#202020',
      },
      node: {
        background: '#1a1a1a',
        border: '#2a2a2a',
        text: '#ffffff',
      },
      canvas: {
        background: '#141414',
        grid: '#202020',
      },
      button: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        hover: '#c0c0c0',
        disabled: '#404040',
        text: '#1a1a1a',
      },
      input: {
        background: '#1a1a1a',
        border: '#2a2a2a',
        focus: '#ffffff',
        placeholder: '#666666',
      },
    },
  },
  {
    name: 'nord',
    label: 'Nord',
    author: 'Arctic Ice Studio',
    description: 'An arctic, north-bluish color palette',
    colors: {
      primary: '#88c0d0',
      secondary: '#81a1c1',
      accent: '#5e81ac',
      background: {
        default: '#2e3440',
        paper: '#3b4252',
        subtle: '#434c5e',
      },
      text: {
        primary: '#eceff4',
        secondary: '#e5e9f0',
        muted: '#d8dee9',
      },
      border: {
        default: '#434c5e',
        subtle: '#4c566a',
      },
      node: {
        background: '#3b4252',
        border: '#434c5e',
        text: '#eceff4',
      },
      canvas: {
        background: '#2e3440',
        grid: '#434c5e',
      },
      button: {
        primary: '#88c0d0',
        secondary: '#81a1c1',
        hover: '#5e81ac',
        disabled: '#434c5e',
        text: '#ffffff',
      },
      input: {
        background: '#3b4252',
        border: '#434c5e',
        focus: '#88c0d0',
        placeholder: '#d8dee9',
      },
    },
  },
]; 