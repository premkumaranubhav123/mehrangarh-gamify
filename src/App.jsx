import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider } from './hooks/useGameContext';
import { useBackend } from './hooks/useBackend';
import StoryIntro from './components/Story/StoryIntro';
import AgeSpecificGameEngine from './components/Game/AgeSpecificGameEngine';
import GalleryView from './components/Gallery/GalleryView';
import Header from './components/UI/Header';
import './styles/VideoLoading.css';
import { 
  preloadCriticalAssets, 
  optimizeVideoDelivery,
  initializeVideoCDN,
  setupVideoAnalytics 
} from './utils/videoOptimizer';
import './styles/App.css';

function BackendStatus() {
  const { backendStatus } = useBackend();
  
  if (backendStatus === 'checking') {
    return null;
  }
  
  return (
    <div className={`backend-status ${backendStatus}`}>
      {backendStatus === 'connected' ? '✅ Backend Connected' : '🔶 Using Local Storage'}
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('intro');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadPhase, setLoadPhase] = useState('initializing');
  const loadPhaseRef = useRef('initializing');

  const { checkBackendConnection, backendStatus } = useBackend();

  useEffect(() => {
    checkBackendConnection();
    
    // Advanced asset loading with progress tracking
    const initializeAssets = async () => {
      console.log('🚀 Initializing application with 75MB video optimization...');
      
      try {
        setLoadPhase('Setting up video delivery');
        loadPhaseRef.current = 'Setting up video delivery';
        
        // Initialize video CDN and analytics
        initializeVideoCDN();
        setupVideoAnalytics();
        
        setLoadPhase('Preloading critical assets');
        loadPhaseRef.current = 'Preloading critical assets';
        setLoadProgress(20);

        // Preload with progress tracking
        await preloadCriticalAssets((progress) => {
          const overallProgress = 20 + (progress * 0.6); // 20-80% for preloading
          setLoadProgress(overallProgress);
        });

        setLoadPhase('Optimizing video delivery');
        loadPhaseRef.current = 'Optimizing video delivery';
        setLoadProgress(85);

        // Final optimizations
        optimizeVideoDelivery();
        
        setLoadPhase('Ready');
        loadPhaseRef.current = 'Ready';
        setLoadProgress(100);

        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAssetsLoaded(true);
        console.log('✅ All assets optimized for 75MB videos');
        
      } catch (error) {
        console.warn('⚠️ Asset optimization failed, continuing with fallbacks:', error);
        setAssetsLoaded(true);
      }
    };

    initializeAssets();

    // Set up periodic cache management for large videos
    const cacheCleanupInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('video-cache')) {
              caches.delete(name);
            }
          });
        });
      }
    }, 300000); // Clean every 5 minutes

    return () => clearInterval(cacheCleanupInterval);
  }, []);

  useEffect(() => {
    console.log(`🌐 Backend status: ${backendStatus}`);
  }, [backendStatus]);

  const views = {
    intro: <StoryIntro onComplete={() => setCurrentView('game')} />,
    game: <AgeSpecificGameEngine onComplete={() => setCurrentView('gallery')} />,
    gallery: <GalleryView onRestart={() => setCurrentView('intro')} />
  };

  return (
    <GameProvider>
      <div className="app">
        <BackendStatus />
        <Header />
        
        {/* Advanced Loading Overlay for 75MB videos */}
        {!assetsLoaded && (
          <div className="global-loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner-large"></div>
              <div className="loading-progress-container">
                <div 
                  className="loading-progress-bar" 
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
              <h3>Optimizing Mehrangarh Experience</h3>
              <p>{loadPhaseRef.current}...</p>
              <div className="loading-details">
                <small>Video files: 75MB each</small>
                <small>Advanced streaming enabled</small>
                <small>Intelligent caching active</small>
              </div>
              <div className="performance-tips">
                <span>💡 Tip: Videos load progressively for best performance</span>
              </div>
            </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {assetsLoaded && views[currentView]}
          </motion.div>
        </AnimatePresence>
      </div>
    </GameProvider>
  );
}

export default App;