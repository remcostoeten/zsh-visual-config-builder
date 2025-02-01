import React, { useEffect, useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useCanvasStore } from './features/canvas/canvas-slice';
import { useSettingsStore } from './features/settings/settings-slice';
import { persistenceService } from './features/persistence/persistence-service';
import { Canvas } from './features/canvas/components/canvas';
import { Introduction } from './components/introduction';
import { DownloadButton } from './features/download/download-button';
import { CanvasActions } from './components/canvas-actions';
import { CanvasSettings } from './components/canvas-settings';
import { Settings } from './components/settings';
import { Footer } from './components/footer';
import { Toast } from './components/ui/toast';
import { useToast } from './hooks/use-toast';
import { RoadmapPage } from './features/roadmap/components/roadmap-page';
import { PathConfig } from './components/path-config';
import { useAuthStore } from './features/auth/github-auth';
import { UserMenu } from './features/auth/components/user-menu';
import { ConfigNode } from './types/config';

function AppContent() {
  const { 
    config, 
    setConfig,
    saveConfig,
    loadConfig,
    isZenMode,
    clearCanvas,
    hasUnsavedChanges,
    markChangesSaved
  } = useCanvasStore();
  const { settings, updateSettings } = useSettingsStore();
  const { state, showToast } = useToast();
  const { handleAuthCallback } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showUnsavedToast, setShowUnsavedToast] = useState(true);

  useEffect(() => {
    const savedConfig = persistenceService.loadConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      markChangesSaved();
    }
  }, []);

  const handleReset = useCallback(() => {
    const savedConfig = persistenceService.loadConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      markChangesSaved();
      setShowUnsavedToast(false);
      showToast({ type: 'success', message: 'Changes reset to last saved version' });
    }
  }, [setConfig, markChangesSaved, showToast]);

  const handleSaveConfig = useCallback(() => {
    saveConfig();
    showToast({ type: 'success', message: 'Configuration saved successfully' });
    setShowUnsavedToast(false);
  }, [saveConfig]);

  const handleLoadConfig = useCallback((config: ConfigNode) => {
    loadConfig(config);
    showToast({ type: 'success', message: 'Configuration loaded successfully' });
  }, [loadConfig]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveConfig();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSaveConfig]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleAuthCallback(code).then(() => {
        navigate('/');
      });
    }
  }, [searchParams]);

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/" element={
        <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
          <div className={`max-w-[1200px] mx-auto px-8 py-8 ${isZenMode ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white/90 to-white/60 bg-clip-text text-transparent">
                ZSH Config Builder
              </h1>
              <div className="flex items-center gap-4">
                <Introduction
                  onTemplateSelect={setConfig}
                  onSaveConfig={handleSaveConfig}
                  onLoadConfig={handleLoadConfig}
                  currentConfig={config}
                />
                <UserMenu />
                <CanvasActions onClearCanvas={clearCanvas} />
                <CanvasSettings settings={settings} onSettingsChange={updateSettings} />
                <Settings settings={settings} onSettingsChange={updateSettings} />
                <DownloadButton 
                  config={config}
                  settings={settings}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <Canvas />
            <PathConfig />
          </div>

          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
            {hasUnsavedChanges && showUnsavedToast && (
              <Toast 
                state={state}
                onReset={handleReset}
                onSave={handleSaveConfig}
                onDismiss={() => setShowUnsavedToast(false)}
              />
            )}
          </div>

          {!isZenMode && <Footer />}
        </div>
      } />
    </Routes>
  );
}

function AuthCallback() {
  const { handleAuthCallback } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleAuthCallback(code).then(() => {
        navigate('/');
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Authenticating...</h2>
        <p className="text-white/50">Please wait while we complete the sign in process.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;