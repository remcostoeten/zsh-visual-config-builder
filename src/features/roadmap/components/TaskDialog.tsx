import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Task } from '../roadmap-slice'

interface Props {
    open: boolean
    onClose: () => void
    onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
    initialData?: Task
}

export default function TaskDialog({ open, onClose, onSave, initialData }: Props) {
    const [title, setTitle] = React.useState(initialData?.title || '')
    const [description, setDescription] = React.useState(initialData?.description || '')
    const [category, setCategory] = React.useState<Task['category']>(
        initialData?.category || 'feature'
    )
    const [priority, setPriority] = React.useState<Task['priority']>(
        initialData?.priority || 'medium'
    )
    const [parentId, setParentId] = React.useState<string | null>(initialData?.parentId || null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            title,
            description,
            category,
            priority,
            parentId,
            completed: initialData?.completed || false
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>{initialData ? 'Edit Task' : 'New Task'}</DialogTitle>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-1'>
                            Title
                        </label>
                        <input
                            type='text'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className='w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg px-3 py-2'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-400 mb-1'>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className='w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg px-3 py-2 h-24'
                            required
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-400 mb-1'>
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as Task['category'])}
                                className='w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg px-3 py-2'
                            >
                                <option value='feature'>Feature</option>
                                <option value='bug'>Bug</option>
                                <option value='improvement'>Improvement</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-400 mb-1'>
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as Task['priority'])}
                                className='w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg px-3 py-2'
                            >
                                <option value='high'>High</option>
                                <option value='medium'>Medium</option>
                                <option value='low'>Low</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex justify-end gap-2 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                        >
                            {initialData ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
