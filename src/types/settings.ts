export interface ConnectorSettings {
    connectorColor: string
    animationSpeed: number
    dashLength: number
    lineWidth: number
    useShebang: boolean
    shebangType: 'zsh' | 'bash'
    defaultShebang: boolean
    animations: {
        enabled: boolean
        speed: 'normal' | 'fast' | 'slow'
    }
}

export type AnimationSpeed = 'normal' | 'fast' | 'slow'

export const ANIMATION_DURATION = {
    fast: 200,
    normal: 300,
    slow: 500
} as const
