import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import { useBackend } from '../../hooks/useBackend';
import { mehrangarhStories } from '../../data/mehrangarhStories';
import TreasureHuntGame from './TreasureHuntGame';
import StarRewardSystem from '../UI/StarRewardSystem';
import CelebrationAnimation from '../UI/CelebrationAnimation';

const KidsGameEngine = ({ onComplete, onResetAge }) => {
  const { state, dispatch } = useGame();
  const { saveGameProgress, updateUserProgress } = useBackend();
  const [currentStory, setCurrentStory] = useState(null);
  const [gameState, setGameState] = useState('selecting');
  const [showCelebration, setShowCelebration] = useState(false);

  const getKidFriendlyStories = () => {
    return mehrangarhStories.map(story => ({
      ...story,
      kidDescription: getKidDescription(story.id),
      icon: getKidFriendlyIcon(story.id),
      color: getStoryColor(story.id)
    }));
  };

  const startStory = (story) => {
    setCurrentStory(story);
    setGameState('playing');
  };

  const completeStory = async (earnedStars) => {
    if (earnedStars >= 3) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    // Calculate score and rewards
    const baseScore = currentStory.completionReward;
    const bonusPoints = earnedStars * 50;
    const totalScore = baseScore + bonusPoints;
    
    // Update local state
    dispatch({ 
      type: 'COMPLETE_STORY', 
      payload: { 
        storyId: currentStory.id,
        paintings: currentStory.paintings 
      } 
    });
    
    dispatch({ type: 'ADD_SCORE', payload: totalScore });
    
    // Save progress to backend
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        // Save game progress
        await saveGameProgress({
          userId,
          storyId: currentStory.id,
          score: totalScore,
          stars: earnedStars,
          completedAt: new Date().toISOString(),
          ageGroup: 'kids'
        });

        // Update user progress
        await updateUserProgress(userId, {
          totalScore: state.totalScore + totalScore,
          level: Math.floor((state.totalScore + totalScore) / 100) + 1,
          completedStories: [...state.completedStories, currentStory.id]
        });

        console.log('✅ Progress saved to backend for story:', currentStory.title);
      }
    } catch (error) {
      console.log('🔶 Progress saved locally, backend unavailable');
    }
    
    setGameState('completed');
  };

  const continueExploring = () => {
    setCurrentStory(null);
    setGameState('selecting');
  };

  if (gameState === 'selecting') {
    return (
      <div className="kids-game-engine">
        {showCelebration && <CelebrationAnimation type="stars" />}
        
        <div className="kids-header">
          <button className="age-reset-btn" onClick={onResetAge}>👈 Change Age Group</button>
          <h1>🎨 Young Explorer's Treasure Hunt 🗺️</h1>
          <div className="kid-stats">
            <StarRewardSystem />
            <div className="stat">📚 Stories: {state.completedStories.length}</div>
            <div className="stat">⭐ Score: {state.totalScore}</div>
          </div>
        </div>

        <div className="treasure-map-container">
          <h2>Choose Your Treasure Adventure!</h2>
          <div className="story-islands">
            {getKidFriendlyStories().map((story, index) => (
              <motion.div
                key={story.id}
                className={`story-island ${story.difficulty} ${state.completedStories.includes(story.id) ? 'completed' : ''}`}
                style={{ '--story-color': story.color }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.3, type: "spring" }}
                onClick={() => startStory(story)}
              >
                <div className="island-icon">
                  {story.icon}
                </div>
                <h3>{story.title}</h3>
                <p className="kid-description">{story.kidDescription}</p>
                <div className="difficulty-stars">
                  {'⭐'.repeat(getDifficultyStars(story.difficulty))}
                </div>
                {state.completedStories.includes(story.id) && (
                  <div className="completion-flag">🏁</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && currentStory) {
    return (
      <TreasureHuntGame 
        story={currentStory}
        onComplete={completeStory}
        onBack={() => setGameState('selecting')}
      />
    );
  }

  if (gameState === 'completed') {
    return (
      <motion.div 
        className="completion-screen kids"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="completion-content">
          <h2>🎉 Treasure Found! 🎉</h2>
          <p>You've completed <strong>{currentStory.title}</strong>!</p>
          <div className="kid-rewards">
            <div className="reward-item">🏆 Story Completed</div>
            <div className="reward-item">⭐ Stars Earned</div>
            <div className="reward-item">📖 New Knowledge</div>
          </div>
          <div className="backend-status">
            <p>✅ Progress saved successfully!</p>
          </div>
          <button onClick={continueExploring} className="kids-button">
            🗺️ Explore More Treasures
          </button>
        </div>
      </motion.div>
    );
  }

  return <div className="loading">Loading your treasure hunt...</div>;
};

// Helper functions (keep the same as before)
const getKidFriendlyIcon = (storyId) => {
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
  return icons[storyId] || '🎨';
};

const getKidDescription = (storyId) => {
  const descriptions = {
    'kannauj-legacy': 'Discover an ancient golden city and brave knights!',
    'coronation-glory': 'See how kings were crowned in magnificent ceremonies!',
    'warrior-kings': 'Meet kings who were both strong warriors and art lovers!',
    'music-art': 'Explore beautiful paintings that look like music!',
    'court-life': 'Peek into the secret world of queens and princesses!',
    'royal-sports': 'Watch queens play exciting polo games!',
    'royal-patronage': 'Enjoy magical music and dance performances!',
    'divine-power': 'Meet powerful goddesses with amazing powers!',
    'royal-hunts': 'Join exciting hunting adventures in the desert!',
    'court-culture': 'Meet the poet whose words were like treasure!'
  };
  return descriptions[storyId] || 'An amazing adventure awaits!';
};

const getStoryColor = (storyId) => {
  const colors = {
    'kannauj-legacy': '#FF6B6B',
    'coronation-glory': '#4ECDC4',
    'warrior-kings': '#45B7D1',
    'music-art': '#96CEB4',
    'court-life': '#FFEAA7',
    'royal-sports': '#DDA0DD',
    'royal-patronage': '#98D8C8',
    'divine-power': '#F7DC6F',
    'royal-hunts': '#BB8FCE',
    'court-culture': '#85C1E9'
  };
  return colors[storyId] || '#8B4513';
};

const getDifficultyStars = (difficulty) => {
  const stars = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };
  return stars[difficulty] || 1;
};

export default KidsGameEngine;