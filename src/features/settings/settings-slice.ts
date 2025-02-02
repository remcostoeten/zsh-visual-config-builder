import { create } from 'zustand'
import { ConnectorSettings } from '../../types/settings'

interface ShellConfig {
    type: 'zsh' | 'bash'
    filename: '.zshrc' | '.bashrc' | '.bash_profile'
}

const defaultSettings: ConnectorSettings = {
    connectorColor: '#6366f1',
    animationSpeed: 1000,
    dashLength: 4,
    lineWidth: 2,
    useShebang: true,
    shebangType: 'zsh',
    defaultShebang: true,
    animations: {
        enabled: true,
        speed: 'normal'
    }
}

interface SettingsState {
    settings: ConnectorSettings
    shellConfig: ShellConfig
    updateSettings: (settings: Partial<ConnectorSettings>) => void
    setShellConfig: (config: Partial<ShellConfig>) => void
}

export const useSettingsStore = create<SettingsState>(set => ({
    settings: defaultSettings,
    shellConfig: {
        type: 'zsh',
        filename: '.zshrc'
    },

    updateSettings: newSettings =>
        set(state => ({
            settings: { ...state.settings, ...newSettings }
        })),

    setShellConfig: config =>
        set(state => ({
            shellConfig: { ...state.shellConfig, ...config },
            settings: {
                ...state.settings,
                shebangType: config.type || state.shellConfig.type
            }
        }))
}))
