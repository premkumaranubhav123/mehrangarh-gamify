import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoPlayer = ({ 
  videoSrc, 
  title, 
  accessibilitySettings,
  onVideoLoad,
  onVideoError 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef(null);

  // Enhanced video event handling with better error recovery
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    console.log(`🎬 Initializing video player for: ${videoSrc}`);

    const handleLoadStart = () => {
      console.log('🔄 Video load started');
      setIsLoading(true);
      setHasError(false);
      setLoadProgress(0);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration || 1;
        const bufferedPercent = (bufferedEnd / duration) * 100;
        setBuffered(bufferedPercent);
        
        // Calculate download progress
        if (video.seekable.length > 0) {
          const loadPercent = (bufferedEnd / duration) * 100;
          setLoadProgress(loadPercent);
        }
      }
    };

    const handleLoadedMetadata = () => {
      console.log('📊 Video metadata loaded, duration:', video.duration);
      setVideoDuration(video.duration);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsLoading(false);
      onVideoLoad?.();
    };

    const handleCanPlayThrough = () => {
      console.log('🎯 Video can play through');
      setIsLoading(false);
    };

    const handleWaiting = () => {
      console.log('⏳ Video waiting/buffering');
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log('▶️ Video playing');
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleError = (e) => {
      console.error('❌ Video error:', e);
      console.error('Video error details:', video.error);
      setIsLoading(false);
      setHasError(true);
      
      // Provide detailed error information
      let errorDetails = 'Unknown error';
      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorDetails = 'Video loading aborted';
            break;
          case 2:
            errorDetails = 'Network error';
            break;
          case 3:
            errorDetails = 'Video decoding error';
            break;
          case 4:
            errorDetails = 'Video not supported';
            break;
        }
      }
      
      onVideoError?.(errorDetails);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking && video.duration) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleSeeking = () => setIsSeeking(true);
    const handleSeeked = () => setIsSeeking(false);

    const handleStalled = () => {
      console.log('⚠️ Video stalled, buffering...');
      setIsLoading(true);
    };

    const handleSuspend = () => {
      console.log('⏸️ Video loading suspended');
    };

    // Add all event listeners
    const events = {
      'loadstart': handleLoadStart,
      'progress': handleProgress,
      'loadedmetadata': handleLoadedMetadata,
      'canplay': handleCanPlay,
      'canplaythrough': handleCanPlayThrough,
      'waiting': handleWaiting,
      'playing': handlePlaying,
      'error': handleError,
      'timeupdate': handleTimeUpdate,
      'play': handlePlay,
      'pause': handlePause,
      'seeking': handleSeeking,
      'seeked': handleSeeked,
      'stalled': handleStalled,
      'suspend': handleSuspend
    };

    Object.entries(events).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    // Set video source and load
    video.preload = 'metadata';
    video.load();

    return () => {
      // Clean up event listeners
      Object.entries(events).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [videoSrc, onVideoLoad, onVideoError, retryCount]);

  const handleRetry = () => {
    console.log('🔄 Retrying video load...');
    setHasError(false);
    setIsLoading(true);
    setLoadProgress(0);
    setRetryCount(prev => prev + 1);
    
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        // For large files, ensure enough data is loaded before playing
        if (video.readyState < 3) {
          console.log('⚠️ Not enough data loaded, waiting...');
          setIsLoading(true);
        }
        
        await video.play();
      }
    } catch (error) {
      console.error('Play/Pause error:', error);
      setHasError(true);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !videoDuration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = percent * videoDuration;
    
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress(percent * 100);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLoadStatus = () => {
    if (loadProgress < 25) return 'Loading video...';
    if (loadProgress < 50) return 'Loading video... (25%)';
    if (loadProgress < 75) return 'Loading video... (50%)';
    if (loadProgress < 95) return 'Loading video... (75%)';
    return 'Almost ready...';
  };

  if (hasError) {
    return (
      <motion.div 
        className="video-error-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-content">
          <div className="error-icon">🎥</div>
          <h3>Video Loading Issue</h3>
          <p>There was a problem loading the video "{title}".</p>
          <div className="error-suggestions">
            <p><strong>Possible solutions:</strong></p>
            <ul>
              <li>• Check your internet connection</li>
              <li>• The video file might be temporarily unavailable</li>
              <li>• Try refreshing the page</li>
              <li>• Large file (40MB) may take time to load</li>
            </ul>
          </div>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-btn">
              🔄 Retry Loading (Attempt {retryCount + 1})
            </button>
          </div>
          <div className="error-debug">
            <small>File: {videoSrc}</small>
            <br />
            <small>Size: ~40MB (Large file)</small>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="video-player-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="video-wrapper">
        {/* Enhanced Loading Overlay */}
        {isLoading && (
          <div className="video-loading-overlay">
            <div className="loading-spinner"></div>
            <p>{getLoadStatus()}</p>
            <div className="loading-progress">
              <div 
                className="loading-progress-bar" 
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>
            <small>File size: ~40MB • Please wait...</small>
            {loadProgress > 0 && loadProgress < 100 && (
              <small>Buffering: {Math.round(buffered)}% ready</small>
            )}
          </div>
        )}
        
        <video
          ref={videoRef}
          className="story-video"
          controls
          preload="metadata"
          playsInline
          webkit-playsinline="true"
          style={{
            border: `3px solid ${accessibilitySettings.highContrast ? '#fff' : '#8B4513'}`,
            opacity: isLoading ? 0.7 : 1
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
            if (videoRef.current) {
              if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
              }
            }
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support HTML5 video.
          <track kind="captions" />
        </video>

        {/* Enhanced Custom Video Controls */}
        <div className="custom-video-controls">
          <button 
            onClick={handlePlayPause}
            className="control-btn play-pause-btn"
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : (isPlaying ? '⏸️' : '▶️')}
          </button>
          
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </div>
          
          <div className="progress-container">
            <div 
              className="video-progress-bg"
              onClick={handleSeek}
            >
              <div 
                className="video-progress-buffered" 
                style={{ width: `${buffered}%` }}
              ></div>
              <div 
                className="video-progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <button 
            className="control-btn fullscreen-btn"
            onClick={() => videoRef.current?.requestFullscreen?.()}
            aria-label="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      <div className="video-meta">
        <p className="video-title">🎬 {title}</p>
        <div className="video-info">
          <span className="file-size">📦 File: ~40MB</span>
          <span className="duration">⏱️ Duration: {formatTime(videoDuration)}</span>
          <span className="buffered">📊 Buffered: {Math.round(buffered)}%</span>
        </div>
        <div className="video-controls-hint">
          💡 Large file - allow time to load • Double-click for fullscreen
          {retryCount > 0 && ` • Retry attempts: ${retryCount}`}
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;