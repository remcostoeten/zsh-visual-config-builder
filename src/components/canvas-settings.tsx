import React from 'react'
import { Settings2, Zap, Weight as LineHeight, Palette } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { ConnectorSettings } from '../types/settings'
import { ColorPicker } from './color-picker'

interface Props {
    settings: ConnectorSettings
    onSettingsChange: (settings: ConnectorSettings) => void
}

export function CanvasSettings({ settings, onSettingsChange }: Props) {
    const handleSpeedChange = (speed: number) => {
        onSettingsChange({ ...settings, animationSpeed: speed })
    }

    const handleLineWidthChange = (width: number) => {
        onSettingsChange({ ...settings, lineWidth: width })
    }

    const handleDashLengthChange = (length: number) => {
        onSettingsChange({ ...settings, dashLength: length })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size='icon'
                    variant='ghost'
                    className='h-9 w-9 rounded-full hover:bg-white/[0.08]'
                >
                    <Settings2 className='h-5 w-5 text-gray-400' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[280px]' align='end'>
                <div className='grid gap-4'>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <Palette className='h-4 w-4 text-gray-400' />
                            <span className='text-[13px] font-medium'>Connector Color</span>
                        </div>
                        <ColorPicker
                            color={settings.connectorColor}
                            onChange={color =>
                                onSettingsChange({ ...settings, connectorColor: color })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <Zap className='h-4 w-4 text-gray-400' />
                            <span className='text-[13px] font-medium'>Animation Speed</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='range'
                                min={500}
                                max={2000}
                                step={100}
                                value={settings.animationSpeed}
                                onChange={e => handleSpeedChange(Number(e.target.value))}
                                className='flex-1'
                            />
                            <span className='text-[13px] text-gray-400 w-12 text-right'>
                                {settings.animationSpeed}ms
                            </span>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <LineHeight className='h-4 w-4 text-gray-400' />
                            <span className='text-[13px] font-medium'>Line Width</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='range'
                                min={1}
                                max={4}
                                step={0.5}
                                value={settings.lineWidth}
                                onChange={e => handleLineWidthChange(Number(e.target.value))}
                                className='flex-1'
                            />
                            <span className='text-[13px] text-gray-400 w-8 text-right'>
                                {settings.lineWidth}px
                            </span>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <LineHeight className='h-4 w-4 text-gray-400 rotate-90' />
                            <span className='text-[13px] font-medium'>Dash Length</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='range'
                                min={0}
                                max={12}
                                step={1}
                                value={settings.dashLength}
                                onChange={e => handleDashLengthChange(Number(e.target.value))}
                                className='flex-1'
                            />
                            <span className='text-[13px] text-gray-400 w-8 text-right'>
                                {settings.dashLength}px
                            </span>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
