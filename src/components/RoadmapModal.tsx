import React from 'react'
import { Dialog, DialogContent, DialogClose } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Lightbulb, Zap, Gauge, Sparkles } from 'lucide-react'

interface RoadmapItem {
    title: string
    description: string
    impact: 'High' | 'Medium' | 'Low'
    effort: 'Easy' | 'Medium' | 'Hard'
    priority: number
    icon: React.ReactNode
}

const roadmapItems: RoadmapItem[] = [
    {
        title: 'Undo/Redo System',
        description:
            'Track state changes for reversible actions, giving users confidence to experiment.',
        impact: 'High',
        effort: 'Easy',
        priority: 1,
        icon: <Zap className='w-5 h-5 text-yellow-500' />
    },
    {
        title: 'Node Search & Filter',
        description: 'Quickly find and filter nodes by title, content, or type.',
        impact: 'High',
        effort: 'Medium',
        priority: 2,
        icon: <Gauge className='w-5 h-5 text-blue-500' />
    },
    {
        title: 'Keyboard Shortcuts',
        description: 'Power user features for faster navigation and editing.',
        impact: 'Medium',
        effort: 'Easy',
        priority: 3,
        icon: <Sparkles className='w-5 h-5 text-purple-500' />
    }
]

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function RoadmapModal({ isOpen, onClose }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
                <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                    <Lightbulb className='w-5 h-5 text-yellow-500' />
                    Development Roadmap
                </h2>  
                <div className='space-y-6'>
                    <p className='text-gray-400 text-sm mt-1'>
                        Upcoming features and improvements planned for the Shell Config Editor
                    </p>

                    <div className='grid gap-4'>
                        {roadmapItems.map((item, index) => (
                            <div
                                key={index}
                                className='bg-white/5 rounded-lg p-4 space-y-3 hover:bg-white/[0.07] transition-colors'
                            >
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center gap-2'>
                                        {item.icon}
                                        <h3 className='text-white font-medium'>{item.title}</h3>
                                    </div>
                                    <div className='flex items-center gap-2 text-xs'>
                                        <span
                                            className={`px-2 py-1 rounded-full ${
                                                item.impact === 'High'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : item.impact === 'Medium'
                                                      ? 'bg-yellow-500/20 text-yellow-400'
                                                      : 'bg-gray-500/20 text-gray-400'
                                            }`}
                                        >
                                            {item.impact} Impact
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full ${
                                                item.effort === 'Easy'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : item.effort === 'Medium'
                                                      ? 'bg-yellow-500/20 text-yellow-400'
                                                      : 'bg-red-500/20 text-red-400'
                                            }`}
                                        >
                                            {item.effort} Effort
                                        </span>
                                    </div>
                                </div>
                                <p className='text-gray-400 text-sm'>{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-end'>
                        <DialogClose asChild>
                            <Button variant='ghost'>Close</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
