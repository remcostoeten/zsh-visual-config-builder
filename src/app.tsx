import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from "./components/ui/toast"
import { MainLayout } from './components/layout/main-layout'
import { Canvas } from './features/canvas/components/canvas'
import RoadmapPage from './features/roadmap/components/roadmap-page'
import PathConfig from './components/path-config'
import { FeaturePromoBanner } from './components/upgrade-banner'
import { AuthCallback } from './features/auth/components/auth-callback'
function AppContent() {
    return (
        <Routes>
            <Route path='/auth/callback' element={<AuthCallback />} />
            <Route path='/roadmap' element={<RoadmapPage />} />
            <Route
                path='/'
                element={
                    <MainLayout>
                        <Canvas />
                        <PathConfig />
                        <FeaturePromoBanner />
                    </MainLayout>
                }
            />
        </Routes>
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