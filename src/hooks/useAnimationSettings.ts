import { useEffect, useState } from 'react'
import { AnimationSpeed, ANIMATION_DURATION } from '../types/settings'

export function useAnimationSettings() {
    const [isEnabled, setIsEnabled] = useState(() => {
        const stored = localStorage.getItem('animations-enabled')
        if (stored === null) {
            return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }
        return stored === 'true'
    })

    const [speed, setSpeed] = useState<AnimationSpeed>(() => {
        return (localStorage.getItem('animation-speed') as AnimationSpeed) || 'normal'
    })

    useEffect(() => {
        localStorage.setItem('animations-enabled', String(isEnabled))
        document.documentElement.style.setProperty(
            '--animation-duration',
            isEnabled ? `${ANIMATION_DURATION[speed]}ms` : '0ms'
        )
        document.documentElement.classList.toggle('disable-animations', !isEnabled)
    }, [isEnabled, speed])

    useEffect(() => {
        localStorage.setItem('animation-speed', speed)
    }, [speed])

    return {
        isEnabled,
        setIsEnabled,
        speed,
        setSpeed,
        duration: ANIMATION_DURATION[speed]
    }
}
