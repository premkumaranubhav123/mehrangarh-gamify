import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioNarration from './AudioNarration';
import VideoPlayer from './VideoPlayer';
import './ChapterReader.css';

const ChapterReader = ({ story, currentChapter, accessibilitySettings, onCompleteChapter }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState('english');
  const [videoLoadState, setVideoLoadState] = useState({});
  const [mediaDebug, setMediaDebug] = useState('');

  // Reset video state when chapter changes
  useEffect(() => {
    setShowVideo(false);
    setVideoLoadState(prev => ({ ...prev, [currentChapter]: 'idle' }));
    
    // Log media URLs for debugging
    if (story) {
      const debugInfo = `
🎬 Media Debug Info:
- Video: ${story.videoFile || 'Not available'}
- English Audio: ${story.audioFile || 'Not available'} 
- Hindi Audio: ${story.hindiAudioFile || 'Not available'}
- Current Chapter: ${currentChapter + 1}
      `;
      console.log(debugInfo);
      setMediaDebug(debugInfo);
    }
  }, [currentChapter, story]);

  if (!story || !story.paintings || !story.paintings[currentChapter]) {
    return <div>Loading chapter...</div>;
  }

  const chapter = story.paintings[currentChapter];
  const hasVideo = story.videoFile;
  const hasEnglishAudio = story.audioFile;
  const hasHindiAudio = story.hindiAudioFile;
  const hasAudio = hasEnglishAudio || hasHindiAudio;

  const getAudioSrc = () => {
    if (audioLanguage === 'hindi' && hasHindiAudio) {
      return story.hindiAudioFile;
    }
    return story.audioFile;
  };

  const getVideoSrc = () => {
    return story.videoFile;
  };

  const handleVideoLoad = () => {
    setVideoLoadState(prev => ({ ...prev, [currentChapter]: 'loaded' }));
    console.log('✅ Video loaded successfully:', getVideoSrc());
  };

  const handleVideoError = (error) => {
    setVideoLoadState(prev => ({ ...prev, [currentChapter]: 'error' }));
    console.error('❌ Video loading failed:', error);
  };

  const handleAudioError = (error) => {
    console.error('🔊 Audio error:', error);
  };

  return (
    <div className={`chapter-reader ${accessibilitySettings.highContrast ? 'high-contrast' : ''} ${accessibilitySettings.fontSize}`}>
      {/* Enhanced Reader Controls */}
      <div className="reader-controls">
        <div className="display-settings">
          {/* Smart Video Toggle - only show if video is available */}
          {hasVideo && (
            <motion.label 
              className="toggle-option video-toggle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input 
                type="checkbox" 
                checked={showVideo}
                onChange={(e) => setShowVideo(e.target.checked)}
                disabled={videoLoadState[currentChapter] === 'error'}
              />
              <span className="toggle-label">
                {showVideo ? '🖼️ Show Image' : '🎥 Show Video'}
              </span>
              {videoLoadState[currentChapter] === 'error' && (
                <span className="error-indicator" title="Video unavailable">⚠️</span>
              )}
            </motion.label>
          )}
          
          {/* Intelligent Language Selection */}
          {hasAudio && (
            <motion.div 
              className="language-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <label>🌐 Audio Language: </label>
              <select 
                value={audioLanguage} 
                onChange={(e) => setAudioLanguage(e.target.value)}
                className="language-select"
              >
                {hasEnglishAudio && (
                  <option value="english">English 🇺🇸</option>
                )}
                {hasHindiAudio && (
                  <option value="hindi">हिन्दी 🇮🇳</option>
                )}
              </select>
            </motion.div>
          )}
        </div>
        
        <div className="navigation-controls">
          <span className="page-indicator">
            📖 Chapter {currentChapter + 1} of {story.paintings.length}
          </span>
        </div>
      </div>

      {/* Debug information (visible in console) */}
      <div style={{ display: 'none' }}>
        <pre>{mediaDebug}</pre>
      </div>

      {/* Main Content Area */}
      <div className="reader-content">
        <motion.div 
          className="chapter-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{chapter.title}</h1>
          
          {hasAudio && (
            <div className="audio-section">
              <AudioNarration 
                audioSrc={getAudioSrc()}
                text={chapter.story}
                language={audioLanguage}
                onError={handleAudioError}
                onPlay={() => console.log('🔊 Audio started playing')}
                onPause={() => console.log('🔊 Audio paused')}
                onComplete={() => console.log('🔊 Audio completed')}
              />
              <div className="language-indicator">
                {audioLanguage === 'hindi' ? 'हिन्दी ऑडियो' : 'English Audio'}
                <span className="volume-warning"> - Ensure device volume is up! 🔊</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Dynamic Media Display */}
        <motion.div 
          className="media-display"
          key={`media-${currentChapter}-${showVideo}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {hasVideo && showVideo ? (
            <VideoPlayer 
              videoSrc={getVideoSrc()}
              title={chapter.title}
              accessibilitySettings={accessibilitySettings}
              onVideoLoad={handleVideoLoad}
              onVideoError={handleVideoError}
            />
          ) : (
            <div className="chapter-image">
              <motion.img 
                src={chapter.imageUrl} 
                alt={chapter.title}
                className="reader-img"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  borderColor: accessibilitySettings.highContrast ? '#fff' : '#8B4513'
                }}
                onError={(e) => {
                  console.error('Image loading failed:', chapter.imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Story Content */}
        <motion.div 
          className="story-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="story-text"
            style={{
              fontSize: accessibilitySettings.fontSize === 'x-large' ? '1.4rem' : 
                       accessibilitySettings.fontSize === 'large' ? '1.2rem' : '1rem',
              lineHeight: accessibilitySettings.extraSpacing ? '2' : '1.6',
              textAlign: accessibilitySettings.simpleLayout ? 'left' : 'justify'
            }}
          >
            <p>{chapter.story}</p>
            
            {chapter.historicalContext && (
              <div className="historical-note">
                <h4>📜 Historical Context:</h4>
                <p>{chapter.historicalContext}</p>
              </div>
            )}
          </div>

          {/* Interactive Clues */}
          {chapter.clues && chapter.clues.length > 0 && (
            <motion.div 
              className="chapter-clues"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4>🔍 Key Points to Remember:</h4>
              <ul>
                {chapter.clues.map((clue, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {clue}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <motion.div 
        className="reader-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="reading-progress">
          <div 
            className="progress-bar"
            style={{ 
              width: `${((currentChapter + 1) / story.paintings.length) * 100}%` 
            }}
          ></div>
          <span>
            📊 Progress: {currentChapter + 1} of {story.paintings.length} chapters
            ({Math.round(((currentChapter + 1) / story.paintings.length) * 100)}%)
          </span>
        </div>
        
        {/* Smart Media Availability Display */}
        <div className="media-availability">
          {hasVideo && (
            <motion.span 
              className={`media-badge video-available ${videoLoadState[currentChapter] === 'error' ? 'unavailable' : ''}`}
              whileHover={{ scale: 1.1 }}
            >
              🎥 {videoLoadState[currentChapter] === 'error' ? 'Video Unavailable' : 'Video Available'}
            </motion.span>
          )}
          {hasEnglishAudio && (
            <motion.span 
              className="media-badge audio-available"
              whileHover={{ scale: 1.1 }}
            >
              🔊 English Audio
            </motion.span>
          )}
          {hasHindiAudio && (
            <motion.span 
              className="media-badge audio-available"
              whileHover={{ scale: 1.1 }}
            >
              🔊 Hindi Audio
            </motion.span>
          )}
        </div>

        {/* Volume reminder */}
        <div className="volume-reminder">
          <small>💡 Tip: Ensure your device volume is turned up for audio narration</small>
        </div>
      </motion.div>
    </div>
  );
};

export default ChapterReader;