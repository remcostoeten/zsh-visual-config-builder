import { useState, useEffect } from 'react'

export function useStaggeredTransition(
    isVisible: boolean,
    itemCount: number,
    staggerDelay: number = 75
) {
    const [visibleItems, setVisibleItems] = useState<boolean[]>([])

    useEffect(() => {
        if (isVisible) {
            const showItems = async () => {
                const items = new Array(itemCount).fill(false)
                setVisibleItems(items)

                for (let i = 0; i < itemCount; i++) {
                    await new Promise(resolve => setTimeout(resolve, staggerDelay))
                    setVisibleItems(prev => {
                        const next = [...prev]
                        next[i] = true
                        return next
                    })
                }
            }

            showItems()
        } else {
            setVisibleItems(new Array(itemCount).fill(false))
        }
    }, [isVisible, itemCount, staggerDelay])

    return visibleItems
}
