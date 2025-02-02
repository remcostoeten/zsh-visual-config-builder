import { motion } from 'framer-motion'
import { CheckCircle2, Circle, CircleDot } from 'lucide-react'

interface RoadmapItem {
    title: string
    description: string
    status: 'completed' | 'in-progress' | 'planned'
    date?: string
}

const roadmapItems: RoadmapItem[] = [
    {
        title: 'Initial Release',
        description:
            'Launch of core features inclquding ZSH configuration builder and script generation',
        status: 'completed',
        date: 'March 2024'
    },
    {
        title: 'Theme Customization',
        description: 'Add support for custom themes and color schemes',
        status: 'in-progress',
        date: 'April 2024'
    },
    {
        title: 'Plugin Manager',
        description: 'Integrated plugin management with search and auto-installation',
        status: 'planned',
        date: 'Q2 2024'
    },
    {
        title: 'Cloud Sync',
        description: 'Save and sync configurations across devices',
        status: 'planned',
        date: 'Q3 2024'
    }
]

const statusIcons = {
    completed: CheckCircle2,
    'in-progress': CircleDot,
    planned: Circle
}

const statusColors = {
    completed: 'text-green-500',
    'in-progress': 'text-blue-500',
    planned: 'text-gray-400'
}

export function RoadmapPage() {
    return (
        <div className='min-h-screen bg-[#0A0A0B] text-white py-16 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-3xl mx-auto'>
                <motion.h1
                    className='text-4xl font-bold mb-8 text-center bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Roadmap
                </motion.h1>

                <div className='space-y-8'>
                    {roadmapItems.map((item, index) => {
                        const Icon = statusIcons[item.status]

                        return (
                            <motion.div
                                key={item.title}
                                className='relative pl-8 pb-8 last:pb-0'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Timeline line */}
                                {index !== roadmapItems.length - 1 && (
                                    <div className='absolute left-[11px] top-6 bottom-0 w-px bg-gray-800' />
                                )}

                                <div className='flex items-start gap-4'>
                                    {/* Status icon */}
                                    <Icon
                                        className={`w-6 h-6 shrink-0 ${statusColors[item.status]}`}
                                    />

                                    {/* Content */}
                                    <div className='flex-1'>
                                        <div className='flex items-center justify-between mb-1'>
                                            <h3 className='text-lg font-semibold'>{item.title}</h3>
                                            {item.date && (
                                                <span className='text-sm text-gray-500'>
                                                    {item.date}
                                                </span>
                                            )}
                                        </div>
                                        <p className='text-gray-400'>{item.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RoadmapPage
