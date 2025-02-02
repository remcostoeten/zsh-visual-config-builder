import { Switch } from '../switch'
import { Label } from '../label'

interface AnimationToggleProps {
    isEnabled: boolean
    onToggle: (enabled: boolean) => void
}

export function AnimationToggle({ isEnabled, onToggle }: AnimationToggleProps) {
    return (
        <div className="flex items-center space-x-2">
            <Switch
                id="animation-mode"
                checked={isEnabled}
                onCheckedChange={onToggle}
            />
            <Label htmlFor="animation-mode">Animations</Label>
        </div>
    )
} 