import { motion } from 'framer-motion'
import { GitBranch, Star, CheckCircle2, Circle, Calendar, Users, Zap, ArrowRight } from 'lucide-react'
import { MainLayout } from '../../../components/layout/main-layout'

interface RoadmapItem {
    title: string
    description: string
    status: 'completed' | 'in-progress' | 'planned'
    timeline?: string
    contributors?: number
    priority: 'high' | 'medium' | 'low'
}

const roadmapItems: RoadmapItem[] = [
    {
        title: 'Visual Config Builder',
        description: 'Drag and drop interface for building shell configurations',
        status: 'completed',
        timeline: 'Released',
        contributors: 2,
        priority: 'high'
    },
    {
        title: 'GitHub Integration',
        description: 'Save and load configurations from GitHub Gists',
        status: 'completed',
        timeline: 'Released',
        contributors: 1,
        priority: 'high'
    },
    {
        title: 'Template System',
        description: 'Pre-built configurations for different use cases',
        status: 'in-progress',
        timeline: 'Q1 2024',
        contributors: 3,
        priority: 'medium'
    },
    {
        title: 'Shell Preview',
        description: 'Live preview of your shell configuration',
        status: 'planned',
        timeline: 'Q2 2024',
        contributors: 0,
        priority: 'medium'
    },
    {
        title: 'Community Sharing',
        description: 'Share and discover configurations from other users',
        status: 'planned',
        timeline: 'Q2 2024',
        contributors: 0,
        priority: 'high'
    },
    {
        title: 'NixOS Support',
        description: 'Configuration management for NixOS and Home Manager',
        status: 'planned',
        timeline: 'Q3 2024',
        contributors: 0,
        priority: 'high'
    },
    {
        title: 'Nix Flakes',
        description: 'Support for Nix Flakes and reproducible builds',
        status: 'planned',
        timeline: 'Q3 2024',
        contributors: 0,
        priority: 'medium'
    },
    {
        title: 'Gist Management',
        description: 'Browse, edit and fork saved shell configurations',
        status: 'in-progress',
        timeline: 'Q2 2024',
        contributors: 1,
        priority: 'high'
    }
]

export function RoadmapPage() {
    return (
        <MainLayout>
            <div className="min-h-[calc(100vh-4rem)] bg-[#1A1A1A]">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-3 mb-8">
                        <GitBranch className="w-6 h-6 text-emerald-400" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Roadmap
                        </h1>
                    </div>

                    <div className="max-w-4xl">
                        <p className="text-zinc-400 mb-12">
                            Track the development progress and upcoming features for the Shell Config Builder.
                        </p>

                        <div className="grid grid-cols-1 gap-8">
                            {roadmapItems.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-8"
                                >
                                    <div className="absolute left-0 top-0 mt-1.5">
                                        {item.status === 'completed' ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        ) : item.status === 'in-progress' ? (
                                            <Star className="w-4 h-4 text-amber-400" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-zinc-600" />
                                        )}
                                    </div>

                                    <motion.div 
                                        className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 group hover:bg-zinc-900/70 transition-colors"
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-zinc-400">{item.description}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-zinc-400">{item.timeline}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-zinc-400">
                                                    {item.contributors} contributor{item.contributors !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <Zap className="w-3.5 h-3.5 text-zinc-500" />
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                                        item.priority === 'high'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : item.priority === 'medium'
                                                            ? 'bg-amber-500/10 text-amber-400'
                                                            : 'bg-zinc-500/10 text-zinc-400'
                                                    }`}
                                                >
                                                    {item.priority === 'high' ? 'MVP' : item.priority.charAt(0).toUpperCase() + item.priority.slice(1) + ' Priority'}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default RoadmapPage
