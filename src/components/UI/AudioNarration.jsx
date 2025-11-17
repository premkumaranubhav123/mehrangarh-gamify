import React, { useState, useRef, useEffect } from 'react';

const AudioNarration = ({ audioSrc, text, language = 'english', autoPlay = false, onPlay, onPause, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && audioSrc) {
      const audio = audioRef.current;
      
      const updateProgress = () => {
        if (audio.duration) {
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleLoadedData = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentTime(audio.duration);
        if (onComplete) onComplete();
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioSrc, onComplete]);

  const handlePlay = async () => {
    if (!audioSrc) return;
    
    setIsLoading(true);
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      if (onPlay) onPlay();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (onPause) onPause();
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    
    audioRef.current.currentTime = seekTime;
    setProgress(percent * 100);
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLanguageLabel = () => {
    return language === 'hindi' ? 'हिन्दी' : 'English';
  };

  return (
    <div className="audio-narration">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
      />
      
      <div className="audio-header">
        <h4>🎧 Audio Narration ({getLanguageLabel()})</h4>
      </div>
      
      <div className="audio-controls">
        {!isPlaying ? (
          <button 
            className="audio-btn play-btn"
            onClick={handlePlay}
            disabled={isLoading || !audioSrc}
            aria-label={`Play ${language} narration`}
          >
            {isLoading ? '⏳' : '▶️'}
          </button>
        ) : (
          <button 
            className="audio-btn pause-btn"
            onClick={handlePause}
            aria-label="Pause narration"
          >
            ⏸️
          </button>
        )}
        
        <button 
          className="audio-btn stop-btn"
          onClick={handleStop}
          disabled={!isPlaying && currentTime === 0}
          aria-label="Stop narration"
        >
          ⏹️
        </button>

        <div className="audio-info">
          <span className="language-tag">
            {language === 'hindi' ? 'हिन्दी' : 'ENG'}
          </span>
        </div>
      </div>

      {audioSrc && (
        <div className="audio-progress-container">
          <div 
            className="audio-progress"
            onClick={handleSeek}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="audio-progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>{formatTime(currentTime)}</span>
            <span> / </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {!audioSrc && text && (
        <div className="audio-hint">
          💡 Audio narration not available for this content
        </div>
      )}

      {!audioSrc && !text && (
        <div className="audio-hint">
          💡 Audio narration available for story content
        </div>
      )}
    </div>
  );
};

export default AudioNarration;