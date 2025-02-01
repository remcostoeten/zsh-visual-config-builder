import { ConfigNode } from '@/types/config'

const STORAGE_KEY = 'zsh-config-builder'

export const persistenceService = {
    saveConfig: (config: ConfigNode) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    },

    loadConfig: (): ConfigNode | null => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : null
    },

    clearConfig: () => {
        localStorage.removeItem(STORAGE_KEY)
    }
}
