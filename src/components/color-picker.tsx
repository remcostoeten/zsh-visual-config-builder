import React from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const popover = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popover.current && !popover.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className='relative'>
            <button
                className='w-full h-8 rounded cursor-pointer border border-[#333] transition-opacity hover:opacity-90'
                style={{ backgroundColor: color }}
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div ref={popover} className='absolute top-full left-0 mt-2 z-50'>
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            )}
        </div>
    )
}
