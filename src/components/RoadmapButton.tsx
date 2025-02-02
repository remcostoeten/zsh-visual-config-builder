import React from 'react'
import { Lightbulb } from 'lucide-react'
import { Button } from './ui/button'
import { RoadmapModal } from './RoadmapModal'
import { FEATURES } from '../config/features'

export function RoadmapButton() {
    const [isOpen, setIsOpen] = React.useState(false)

    if (!FEATURES.SHOW_ROADMAP) return null

    return (
        <>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsOpen(true)}
                className='h-9 w-9 rounded-full hover:bg-white/[0.08] relative group'
            >
                <Lightbulb className='h-5 w-5 text-yellow-500/80 group-hover:text-yellow-500 transition-colors' />
                <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                    Roadmap
                </span>
            </Button>

            <RoadmapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
