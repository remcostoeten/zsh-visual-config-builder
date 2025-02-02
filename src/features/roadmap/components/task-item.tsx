import React from 'react'
import { motion } from 'framer-motion'
import { Check, Edit2, Trash2 } from 'lucide-react'
import { Task, useRoadmapStore } from '../roadmap-slice'
import TaskDialog from './TaskDialog'
import { formatDistanceToNow } from 'date-fns'

interface Props {
    task: Task
}

export default function TaskItem({ task }: Props) {
    const { updateTask, deleteTask } = useRoadmapStore()
    const [showEdit, setShowEdit] = React.useState(false)

    const priorityColors = {
        high: 'bg-red-500/20 text-red-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
        low: 'bg-green-500/20 text-green-400'
    }

    const categoryColors = {
        feature: 'bg-indigo-500/20 text-indigo-400',
        bug: 'bg-red-500/20 text-red-400',
        improvement: 'bg-emerald-500/20 text-emerald-400'
    }

    return (
        <>
            <motion.div
                layout
                className={`bg-[#252525] rounded-lg p-4 border border-[#333] ${
                    task.completed ? 'opacity-50' : ''
                }`}
            >
                <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-start gap-3 flex-1'>
                        <button
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'border-gray-500 hover:border-indigo-500'
                            }`}
                        >
                            {task.completed && <Check className='w-3 h-3 text-white' />}
                        </button>

                        <div className='flex-1'>
                            <h3
                                className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}
                            >
                                {task.title}
                            </h3>

                            <p className='text-gray-400 text-sm mt-1'>{task.description}</p>

                            <div className='flex items-center gap-2 mt-3'>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}
                                >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{' '}
                                    Priority
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${categoryColors[task.category]}`}
                                >
                                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                                </span>
                                <span className='text-xs text-gray-500'>
                                    Updated {formatDistanceToNow(task.updatedAt)} ago
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setShowEdit(true)}
                            className='p-1 text-gray-400 hover:text-white transition-colors'
                        >
                            <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className='p-1 text-gray-400 hover:text-red-400 transition-colors'
                        >
                            <Trash2 className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            </motion.div>

            <TaskDialog
                open={showEdit}
                onClose={() => setShowEdit(false)}
                onSave={updates => {
                    updateTask(task.id, updates)
                    setShowEdit(false)
                }}
                initialData={task}
            />
        </>
    )
}
