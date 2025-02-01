import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
    id: string
    title: string
    description: string
    completed: boolean
    parentId: string | null
    createdAt: number
    updatedAt: number
    category: 'feature' | 'bug' | 'improvement'
    priority: 'high' | 'medium' | 'low'
}

interface RoadmapState {
    tasks: Task[]
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
    reorderTask: (id: string, newParentId: string | null) => void
}

export const useRoadmapStore = create<RoadmapState>()(
    persist(
        set => ({
            tasks: [],

            addTask: task =>
                set(state => ({
                    tasks: [
                        ...state.tasks,
                        {
                            ...task,
                            id: crypto.randomUUID(),
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        }
                    ]
                })),

            updateTask: (id, updates) =>
                set(state => ({
                    tasks: state.tasks.map(task =>
                        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
                    )
                })),

            deleteTask: id =>
                set(state => ({
                    tasks: state.tasks.filter(task => task.id !== id)
                })),

            reorderTask: (id, newParentId) =>
                set(state => ({
                    tasks: state.tasks.map(task =>
                        task.id === id
                            ? { ...task, parentId: newParentId, updatedAt: Date.now() }
                            : task
                    )
                }))
        }),
        {
            name: 'roadmap-storage'
        }
    )
)
