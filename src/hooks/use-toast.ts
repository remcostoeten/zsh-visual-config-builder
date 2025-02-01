import { useState } from 'react'

type ToastState = {
    type: 'initial' | 'loading' | 'success' | 'error'
    message?: string
}

export function useToast() {
    const [state, setState] = useState<ToastState>({ type: 'initial' })

    const showToast = (options: ToastState) => {
        setState(options)
    }

    return { state, showToast }
}
