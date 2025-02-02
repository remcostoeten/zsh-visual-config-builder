import { create } from 'zustand'

interface ToastState {
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
    showToast: (message: string, type: 'success' | 'error' | 'info') => void
    hideToast: () => void
}

export const useToast = create<ToastState>((set) => ({
    message: '',
    type: 'info',
    isVisible: false,
    showToast: (message, type) => {
        set({ message, type, isVisible: true })
        setTimeout(() => {
            set({ isVisible: false })
        }, 3000)
    },
    hideToast: () => set({ isVisible: false })
}))

export const toast = {
    success: (message: string) => useToast.getState().showToast(message, 'success'),
    error: (message: string) => useToast.getState().showToast(message, 'error'),
    info: (message: string) => useToast.getState().showToast(message, 'info')
} 