import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { Button } from "../button"

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[65px] px-2 py-1"
                >
                    <div className="w-full h-4 rounded" style={{ backgroundColor: color }} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
                <HexColorPicker color={color} onChange={onChange} />
            </PopoverContent>
        </Popover>
    )
} 