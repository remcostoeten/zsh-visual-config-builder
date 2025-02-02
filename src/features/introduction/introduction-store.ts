import { create } from 'zustand'
import { ConfigNode } from '@/types/config'

interface IntroductionStore {
    showSaveAlert: boolean
    showAuthAlert: boolean
    pendingTemplate: ConfigNode | null
    setShowSaveAlert: (show: boolean) => void
    setShowAuthAlert: (show: boolean) => void
    setPendingTemplate: (template: ConfigNode | null) => void
    reset: () => void
}

export const useIntroductionStore = create<IntroductionStore>((set) => ({
    showSaveAlert: false,
    showAuthAlert: false,
    pendingTemplate: null,
    setShowSaveAlert: (show) => set({ showSaveAlert: show }),
    setShowAuthAlert: (show) => set({ showAuthAlert: show }),
    setPendingTemplate: (template) => set({ pendingTemplate: template }),
    reset: () => set({ showSaveAlert: false, showAuthAlert: false, pendingTemplate: null })
})) 