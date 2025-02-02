import { useCallback, useEffect, useState } from 'react'
import {
    Route,
    BrowserRouter as Router,
    Routes,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import Footer from './components/footer'
import PathConfig from './components/path-config'
import { ToastProvider } from './components/ui/toast'
import { FeaturePromoBanner } from './components/upgrade-banner'
import { useAuthStore } from './features/auth/github-auth'
import { useCanvasStore } from './features/canvas/canvas-slice'
import { Canvas } from './features/canvas/components/canvas'
import { persistenceService } from './features/persistence/persistence-service'
import { RoadmapPage } from './features/roadmap/components/roadmap-page'
import { useToast } from './components/ui/toast'

function AppContent() {
    const {
        setConfig,
        saveConfig,
        isZenMode,
        hasUnsavedChanges,
        markChangesSaved,
        lastSavedConfig
    } = useCanvasStore()
    const { addToast } = useToast()
    const { handleAuthCallback } = useAuthStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [showUnsavedToast, setShowUnsavedToast] = useState(false)

    useEffect(() => {
        const savedConfig = persistenceService.loadConfig()
        if (savedConfig) {
            setConfig([savedConfig])
            markChangesSaved()
        }
    }, [markChangesSaved, setConfig])

    useEffect(() => {
        if (hasUnsavedChanges) {
            setShowUnsavedToast(true)
        }
    }, [hasUnsavedChanges])
    const handleReset = () => {
        setConfig([lastSavedConfig])
        markChangesSaved()
        setShowUnsavedToast(false)
    }

    const handleSaveConfig = useCallback(() => {
        saveConfig()
        addToast('Configuration saved successfully', 'success')
        setShowUnsavedToast(false)
    }, [saveConfig, addToast])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === 's') {
                e.preventDefault()
                handleSaveConfig()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleSaveConfig])

    useEffect(() => {
        const code = searchParams.get('code')
        if (code) {
            handleAuthCallback(code).then(() => {
                navigate('/')
            })
        }
    }, [handleAuthCallback, navigate, searchParams])

    return (
        <Routes>
            <Route path='/auth/callback' element={<AuthCallback />} />
            <Route path='/roadmap' element={<RoadmapPage />} />
            <Route
                path='/'
                element={
                    <div className='min-h-screen bg-[#1A1A1A] text-white pb-20'>
                        <div className='relative'>
                            <Canvas />
                            <PathConfig />
                        </div>
                        <Footer />
                        {/* {!isZenMode && <Footer />} */}
                        <FeaturePromoBanner />
                    </div>
                }
            />
        </Routes>
    )
}

function AuthCallback() {
    const { handleAuthCallback } = useAuthStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const code = searchParams.get('code')
        if (code) {
            handleAuthCallback(code).then(() => {
                navigate('/')
            })
        }
    }, [handleAuthCallback, navigate, searchParams])

    return (
        <div className='min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center'>
            <div className='text-center'>
                <h2 className='text-xl font-medium mb-2'>Authenticating...</h2>
                <p className='text-white/50'>Please wait while we complete the sign in process.</p>
            </div>
        </div>
    )
}

function App() {
    return (
        <Router>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </Router>
    )
}

export default App
