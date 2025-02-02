import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Filter, SortDesc } from 'lucide-react'
import { useRoadmapStore, Task } from '../roadmap-slice'
import TaskItem from './TaskItem'
import TaskDialog from './TaskDialog'

export default function RoadmapPage() {
    const { tasks, addTask } = useRoadmapStore()
    const [showNewTask, setShowNewTask] = React.useState(false)
    const [filter, setFilter] = React.useState<Task['category'] | 'all'>('all')
    const [sortBy, setSortBy] = React.useState<'priority' | 'date'>('priority')

    const filteredTasks = React.useMemo(() => {
        let result = tasks

        if (filter !== 'all') {
            result = result.filter(task => task.category === filter)
        }

        result = result.sort((a, b) => {
            if (sortBy === 'priority') {
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                return priorityOrder[a.priority] - priorityOrder[b.priority]
            }
            return b.updatedAt - a.updatedAt
        })

        return result
    }, [tasks, filter, sortBy])

    const rootTasks = filteredTasks.filter(task => !task.parentId)

    const renderTask = (task: Task, depth = 0) => {
        const childTasks = filteredTasks.filter(t => t.parentId === task.id)

        return (
            <div key={task.id} style={{ marginLeft: depth * 24 }}>
                <TaskItem task={task} />
                {childTasks.map(childTask => renderTask(childTask, depth + 1))}
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#1A1A1A] text-white pb-20'>
            <div className='max-w-[1200px] mx-auto px-8 py-8'>
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-4'>
                        <Link
                            to='/'
                            className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
                        >
                            <ArrowLeft className='w-5 h-5' />
                            Back to Editor
                        </Link>
                        <h1 className='text-2xl font-bold'>Product Roadmap</h1>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2 bg-[#252525] rounded-lg p-2'>
                            <Filter className='w-4 h-4 text-gray-400' />
                            <select
                                value={filter}
                                onChange={e =>
                                    setFilter(e.target.value as Task['category'] | 'all')
                                }
                                className='bg-transparent text-sm text-gray-300 outline-none'
                            >
                                <option value='all'>All Categories</option>
                                <option value='feature'>Features</option>
                                <option value='bug'>Bugs</option>
                                <option value='improvement'>Improvements</option>
                            </select>
                        </div>

                        <div className='flex items-center gap-2 bg-[#252525] rounded-lg p-2'>
                            <SortDesc className='w-4 h-4 text-gray-400' />
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as 'priority' | 'date')}
                                className='bg-transparent text-sm text-gray-300 outline-none'
                            >
                                <option value='priority'>Sort by Priority</option>
                                <option value='date'>Sort by Date</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setShowNewTask(true)}
                            className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors'
                        >
                            <Plus className='w-4 h-4' />
                            Add Task
                        </button>
                    </div>
                </div>

                <motion.div
                    className='space-y-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {rootTasks.map(task => renderTask(task))}
                </motion.div>
            </div>

            <TaskDialog
                open={showNewTask}
                onClose={() => setShowNewTask(false)}
                onSave={task => {
                    addTask(task)
                    setShowNewTask(false)
                }}
            />
        </div>
    )
}
