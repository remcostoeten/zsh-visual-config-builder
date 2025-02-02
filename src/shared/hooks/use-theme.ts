import { create } from 'zustand'

interface ThemeStore {
    theme: 'dark' | 'light'
    setTheme: (theme: 'dark' | 'light') => void
}

export const useTheme = create<ThemeStore>((set) => ({
    theme: 'dark',
    setTheme: (theme) => set({ theme }),
})) 