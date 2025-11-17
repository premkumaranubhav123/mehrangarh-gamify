// src/components/Game/SeniorsGameEngine.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import { mehrangarhStories } from '../../data/mehrangarhStories';
import ChapterReader from '../UI/ChapterReader';
import MemoryJournal from '../UI/MemoryJournal';
import AudioNarration from '../UI/AudioNarration';
import AccessibilityPanel from '../UI/AccessibilityPanel';

const SeniorsGameEngine = ({ onComplete, onResetAge }) => {
  const { state, dispatch } = useGame();
  const [currentStory, setCurrentStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [gameState, setGameState] = useState('selecting');
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'large',
    highContrast: false,
    reducedMotion: false,
    audioEnabled: true,
    simpleLayout: true,
    extraSpacing: true
  });
  const [memoryEntries, setMemoryEntries] = useState([]);
  const [showAccessibility, setShowAccessibility] = useState(false);

  // Base URL for media files
  const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return '/api/media';
    }
    return 'http://localhost:5001/api/media';
  };

  const BASE_URL = getBaseUrl();

  // Enhanced media URL construction with proper error handling
  const getVideoUrl = (videoId) => {
    if (!videoId) {
      console.warn('⚠️ No videoId provided to getVideoUrl');
      return null;
    }
    return `${BASE_URL}/video/${videoId}`;
  };

  const getAudioUrl = (type, audioId) => {
    if (!type || !audioId) {
      console.warn('⚠️ Missing parameters for getAudioUrl:', { type, audioId });
      return null;
    }
    return `${BASE_URL}/audio/${type}/${audioId}`;
  };

  const startStory = (story) => {
    // Use the original story but ensure media URLs are properly constructed
    const enhancedStory = {
      ...story,
      // Use the URLs from the original story data (they should be properly constructed)
      audioFile: story.audioFile,
      hindiAudioFile: story.hindiAudioFile,
      videoFile: story.videoFile
    };
    
    console.log('🎬 Starting story with media:', {
      audio: enhancedStory.audioFile,
      hindiAudio: enhancedStory.hindiAudioFile,
      video: enhancedStory.videoFile
    });
    
    setCurrentStory(enhancedStory);
    setGameState('reading');
    setCurrentChapter(0);
  };

  const completeChapter = () => {
    if (currentChapter < currentStory.paintings.length - 1) {
      setCurrentChapter(prev => prev + 1);
    } else {
      completeStory();
    }
  };

  const completeStory = () => {
    dispatch({ 
      type: 'COMPLETE_STORY', 
      payload: { 
        storyId: currentStory.id,
        paintings: currentStory.paintings 
      } 
    });
    
    // Gentle reward system for seniors
    dispatch({ type: 'ADD_SCORE', payload: Math.round(currentStory.completionReward * 0.8) });
    
    setGameState('reflection');
  };

  const saveMemoryEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      storyTitle: getSeniorFriendlyTitle(currentStory.id),
      text: entry,
      storyId: currentStory.id
    };
    setMemoryEntries(prev => [...prev, newEntry]);
  };

  const continueExploring = () => {
    setCurrentStory(null);
    setGameState('selecting');
    setCurrentChapter(0);
  };

  // Test media URLs on component mount
  useEffect(() => {
    const testMediaUrls = async () => {
      try {
        console.log('🧪 Testing media server connectivity...');
        const response = await fetch(`${BASE_URL}/health`);
        const health = await response.json();
        console.log('✅ Media server health:', health);
        
        // Test a sample video and audio
        const videoTest = await fetch(`${BASE_URL}/test/video/v1`);
        const videoResult = await videoTest.json();
        console.log('🎬 Video test result:', videoResult);
        
        const audioTest = await fetch(`${BASE_URL}/test/english/a1`);
        const audioResult = await audioTest.json();
        console.log('🔊 Audio test result:', audioResult);
        
      } catch (error) {
        console.error('❌ Media server test failed:', error);
      }
    };
    
    testMediaUrls();
  }, [BASE_URL]);

  if (gameState === 'selecting') {
    return (
      <div className={`seniors-selection ${accessibilitySettings.highContrast ? 'high-contrast' : ''} ${accessibilitySettings.simpleLayout ? 'simple-layout' : ''}`}>
        <div className="seniors-header">
          <div className="header-controls">
            <button className="age-reset-btn" onClick={onResetAge}>🔄 Change Mode</button>
            <button 
              className="accessibility-btn"
              onClick={() => setShowAccessibility(!showAccessibility)}
            >
              ♿ Settings
            </button>
          </div>
          
          <h1 style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '3rem' : '2.5rem' }}>
            👴 Cultural Heritage Journey
          </h1>
          
          <div className="seniors-stats">
            <div className="stat">📚 Stories: {state.completedStories.length}</div>
            <div className="stat">🕒 Relaxed Pace</div>
            <div className="stat">🔊 Audio Ready</div>
          </div>
        </div>

        {showAccessibility && (
          <AccessibilityPanel 
            settings={accessibilitySettings}
            onSettingsChange={setAccessibilitySettings} 
          />
        )}

        <div className="heritage-library">
          <h2 style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '2.2rem' : '1.8rem' }}>
            📖 Heritage Stories Collection
          </h2>
          <p className="library-subtitle" style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.3rem' : '1.1rem' }}>
            Relax and immerse yourself in these timeless stories from Mehrangarh's rich history
          </p>

          <div className="stories-collection">
            {mehrangarhStories.map((story, index) => (
              <motion.div
                key={story.id}
                className={`heritage-story ${state.completedStories.includes(story.id) ? 'completed' : ''} ${accessibilitySettings.simpleLayout ? 'simple' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                onClick={() => startStory(story)}
                style={{
                  fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.2rem' : '1rem',
                  lineHeight: accessibilitySettings.extraSpacing ? '1.8' : '1.5'
                }}
              >
                <div className="story-preview">
                  <div className="story-icon">{getSeniorFriendlyIcon(story.id)}</div>
                  <div className="story-info">
                    <h3>{getSeniorFriendlyTitle(story.id)}</h3>
                    <p className="story-teaser">{getSeniorTeaser(story.id)}</p>
                    <div className="story-meta">
                      <span className="chapters">{story.paintings.length} Chapters</span>
                      <span className="reading-time">~{story.paintings.length * 5} min read</span>
                    </div>
                    <div className="media-indicators">
                      {story.videoFile && <span className="media-indicator">🎥 Video</span>}
                      {story.audioFile && <span className="media-indicator">🔊 English Audio</span>}
                      {story.hindiAudioFile && <span className="media-indicator">🔊 Hindi Audio</span>}
                    </div>
                  </div>
                </div>
                
                {state.completedStories.includes(story.id) && (
                  <div className="completion-mark">✅ Enjoyed</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="seniors-guidance">
          <h3>💫 Guidance for Your Journey</h3>
          <div className="guidance-tips">
            <div className="tip">🎧 Use audio narration for comfortable listening</div>
            <div className="tip">📖 Read at your own pace - no time limits</div>
            <div className="tip">📝 Record your memories in the journal</div>
            <div className="tip">⚙️ Adjust settings for your comfort</div>
            <div className="tip">🔊 Ensure your device volume is turned up for audio</div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'reading' && currentStory) {
    return (
      <div className={`seniors-reading ${accessibilitySettings.highContrast ? 'high-contrast' : ''}`}>
        <div className="reading-header">
          <button 
            className="back-to-library"
            onClick={() => setGameState('selecting')}
            style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.2rem' : '1rem' }}
          >
            ← Back to Library
          </button>
          
          <h2 style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '2.2rem' : '1.8rem' }}>
            {getSeniorFriendlyTitle(currentStory.id)}
          </h2>
          
          <button 
            className="settings-toggle"
            onClick={() => setShowAccessibility(!showAccessibility)}
            style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.2rem' : '1rem' }}
          >
            ♿
          </button>
        </div>

        {showAccessibility && (
          <div className="floating-settings">
            <AccessibilityPanel 
              settings={accessibilitySettings}
              onSettingsChange={setAccessibilitySettings} 
            />
          </div>
        )}

        <div className="reading-content">
          <ChapterReader 
            story={currentStory}
            currentChapter={currentChapter}
            accessibilitySettings={accessibilitySettings}
            onCompleteChapter={completeChapter}
          />
        </div>

        <div className="reading-navigation">
          <button 
            onClick={() => setCurrentChapter(prev => Math.max(0, prev - 1))}
            disabled={currentChapter === 0}
            className="nav-btn prev-btn"
          >
            ← Previous Chapter
          </button>
          
          <div className="chapter-progress">
            Chapter {currentChapter + 1} of {currentStory.paintings.length}
          </div>
          
          {currentChapter < currentStory.paintings.length - 1 ? (
            <button 
              onClick={() => setCurrentChapter(prev => prev + 1)}
              className="nav-btn next-btn"
            >
              Next Chapter →
            </button>
          ) : (
            <button 
              onClick={completeStory}
              className="nav-btn complete-btn"
            >
              Finish Story 🎉
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'reflection' && currentStory) {
    return (
      <div className={`seniors-reflection ${accessibilitySettings.highContrast ? 'high-contrast' : ''}`}>
        <div className="reflection-header">
          <h2 style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '2.5rem' : '2rem' }}>
            📖 Story Complete
          </h2>
          <p style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.3rem' : '1.1rem' }}>
            You've finished "{getSeniorFriendlyTitle(currentStory.id)}"
          </p>
        </div>

        <div className="reflection-content">
          <div className="completion-celebration">
            <div className="celebration-message">
              🌟 Thank you for exploring this piece of history!
            </div>
            <div className="gentle-reward">
              +{Math.round(currentStory.completionReward * 0.8)} appreciation points
            </div>
          </div>

          <MemoryJournal 
            story={currentStory}
            onSaveEntry={saveMemoryEntry}
            accessibilitySettings={accessibilitySettings}
          />

          <div className="reflection-actions">
            <button 
              onClick={continueExploring}
              className="action-btn continue-btn"
              style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.3rem' : '1.1rem' }}
            >
              📚 Explore Another Story
            </button>
            
            <button 
              onClick={onComplete}
              className="action-btn gallery-btn"
              style={{ fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.3rem' : '1.1rem' }}
            >
              🖼️ Visit Gallery
            </button>
          </div>
        </div>

        {memoryEntries.length > 0 && (
          <div className="recent-memories">
            <h3>Your Recent Reflections</h3>
            <div className="memories-preview">
              {memoryEntries.slice(-2).map(entry => (
                <div key={entry.id} className="memory-preview">
                  <strong>{entry.storyTitle}</strong>
                  <p>{entry.text.substring(0, 100)}...</p>
                  <small>{entry.timestamp}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="seniors-loading">
      <div className="loading-message">
        Preparing your cultural journey...
      </div>
    </div>
  );
};

// Helper functions for seniors version
const getSeniorFriendlyIcon = (storyId) => {
  const icons = {
    'kannauj-legacy': '🏰',
    'coronation-glory': '👑',
    'warrior-kings': '⚔️',
    'music-art': '🎵',
    'court-life': '👸',
    'royal-sports': '🏇',
    'royal-patronage': '🎭',
    'divine-power': '✨',
    'royal-hunts': '🎯',
    'court-culture': '📜'
  };
  return icons[storyId] || '📖';
};

const getSeniorFriendlyTitle = (storyId) => {
  const titles = {
    'kannauj-legacy': 'The Journey from Kannauj',
    'coronation-glory': 'A Royal Coronation',
    'warrior-kings': 'Kings and Their Deeds',
    'music-art': 'Music in Beautiful Art',
    'court-life': 'Life in the Royal Court',
    'royal-sports': 'Royal Games and Sports',
    'royal-patronage': 'Kings Who Loved Arts',
    'divine-power': 'Stories of Goddesses',
    'royal-hunts': 'Royal Hunting Adventures',
    'court-culture': 'The Poet and His Words'
  };
  return titles[storyId] || 'A Historical Story';
};

const getSeniorTeaser = (storyId) => {
  const teasers = {
    'kannauj-legacy': 'The inspiring story of how the Rathore family journeyed to build a new home',
    'coronation-glory': 'Witness the magnificent ceremony where kings were crowned in splendor',
    'warrior-kings': 'Discover kings who were both brave warriors and lovers of art and culture',
    'music-art': 'Explore paintings that beautifully capture the emotion and rhythm of music',
    'court-life': 'Step into the private world of queens and learn about their influence',
    'royal-sports': 'See how royalty enjoyed sports and games in their leisure time',
    'royal-patronage': 'Learn about kings who generously supported artists and musicians',
    'divine-power': 'Discover the many forms of the goddess and their spiritual significance',
    'royal-hunts': 'Join exciting hunting expeditions in the beautiful Rajasthan landscape',
    'court-culture': 'Meet the respected poet whose words preserved history and honored kings'
  };
  return teasers[storyId] || 'A fascinating story from the rich heritage of Rajasthan';
};

export default SeniorsGameEngine;