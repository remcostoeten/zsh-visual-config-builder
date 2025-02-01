import { Heart, Coffee, BookOpen, Github } from 'lucide-react'

export default function Footer() {
    return (
        <footer className='fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#333] py-3'>
            <div className='max-w-[1200px] mx-auto px-8 flex justify-between items-center'>
                <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-2 text-gray-400'>
                        Built with{' '}
                        <Heart className='w-4 h-4 text-red-500 animate-pulse' fill='currentColor' />{' '}
                        by{' '}
                        <a
                            href='https://github.com/remcostoeten'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white hover:text-indigo-400 transition-colors'
                        >
                            @remcostoeten
                        </a>
                    </div>

                    <a
                        href='https://ko-fi.com/remcostoeten'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors'
                    >
                        <Coffee className='w-4 h-4' />
                        <span>Buy me a coffee</span>
                    </a>
                </div>

                <div className='flex items-center gap-4'>
                    <a
                        href='https://docs.zsh.org/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
                    >
                        <BookOpen className='w-4 h-4' />
                        <span>ZSH Docs</span>
                    </a>

                    <a
                        href='https://github.com/remcostoeten/zshrc-visual-editor'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
                    >
                        <Github className='w-4 h-4' />
                        <span>Source</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}
