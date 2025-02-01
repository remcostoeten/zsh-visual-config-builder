import { User, LogOut, Book } from 'lucide-react'
import { useAuthStore } from '../github-auth'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { githubGistService } from '@/features/persistence/github-gist'

interface Gist {
    id: string
    description: string
    updated_at: string
}

export function UserMenu() {
    // ... component implementation
}
