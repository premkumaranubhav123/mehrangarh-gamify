import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import { mehrangarhStories } from '../../data/mehrangarhStories';
import KidsTreasureMap from '../UI/KidsTreasureMap';
import CelebrationAnimation from '../UI/CelebrationAnimation';

const KidsGameEngine = ({ onComplete, onResetAge }) => {
  const { state, dispatch } = useGame();
  const [currentStory, setCurrentStory] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameState, setGameState] = useState('selecting');
  const [stars, setStars] = useState(0);
  const [collectedItems, setCollectedItems] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const kidFriendlyStories = mehrangarhStories.map(story => ({
    ...story,
    kidTitle: getKidFriendlyTitle(story.id),
    kidDescription: getKidFriendlyDescription(story.id),
    treasure: getStoryTreasure(story.id),
    emoji: getKidFriendlyIcon(story.id)
  }));

  const startStory = (story) => {
    setCurrentStory(story);
    setGameState('playing');
    setCurrentPuzzle(0);
    setStars(0);
  };

  const completePuzzle = (points) => {
    const earnedStars = Math.ceil(points / 50);
    setStars(prev => prev + earnedStars);
    
    // Celebration for kids
    if (earnedStars >= 2) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }

    dispatch({ type: 'ADD_SCORE', payload: points });

    if (currentPuzzle < currentStory.paintings.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
    } else {
      // Story completed
      const completionStars = 5;
      setStars(prev => prev + completionStars);
      setCollectedItems(prev => [...prev, currentStory.treasure]);
      
      dispatch({ 
        type: 'COMPLETE_STORY', 
        payload: { 
          storyId: currentStory.id,
          paintings: currentStory.paintings 
        } 
      });
      dispatch({ type: 'ADD_SCORE', payload: currentStory.completionReward });
      
      setGameState('completed');
    }
  };

  // Treasure Hunt Selection Screen
  if (gameState === 'selecting') {
    return (
      <div className="kids-selection">
        <div className="kids-header">
          <button className="age-reset-btn" onClick={onResetAge}>👈 Change Adventure</button>
          <h1>🎨 Young Explorer's Treasure Hunt 🗺️</h1>
          <div className="kid-stats">
            <div className="stat">🌟 {stars} Stars</div>
            <div className="stat">🏆 {state.completedStories.length} Treasures</div>
            <div className="stat">📚 Level {state.level}</div>
          </div>
        </div>

        <div className="treasure-map-container">
          <h2>🗺️ Choose Your Treasure Adventure!</h2>
          
          <KidsTreasureMap 
            stories={kidFriendlyStories}
            completedStories={state.completedStories}
            onStorySelect={startStory}
            stars={stars}
            collectedItems={collectedItems}
          />
        </div>

        {collectedItems.length > 0 && (
          <div className="treasure-chest-display">
            <h3>Your Treasure Collection:</h3>
            <div className="collected-items">
              {collectedItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="treasure-item"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  🎁 {item}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Game Playing Screen
  if (gameState === 'playing' && currentStory) {
    const currentPainting = currentStory.paintings[currentPuzzle];
    
    return (
      <div className="kids-game-container">
        <div className="game-header">
          <button className="back-btn" onClick={() => setGameState('selecting')}>← Back to Map</button>
          <div className="game-stats">
            <span>🌟 {stars}</span>
            <span>Puzzle {currentPuzzle + 1}/{currentStory.paintings.length}</span>
          </div>
        </div>

        <div className="painting-adventure">
          <div className="story-character">
            <div className="character-speech">
              <span className="character">🧙‍♂️ Story Wizard:</span>
              <p>{convertToKidStory(currentPainting.story)}</p>
            </div>
          </div>

          <div className="painting-mystery">
            <motion.img
              src={currentPainting.imageUrl}
              alt={currentPainting.title}
              className="magic-painting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="kids-questions">
            <h4>🧩 Solve the Mystery!</h4>
            {currentPainting.questions.map((question, index) => (
              <div key={index} className="question-card-kids">
                <h5>{convertToKidQuestion(question.question)}</h5>
                <div className="options-grid-kids">
                  {question.options.map((option, optIndex) => (
                    <motion.button
                      key={optIndex}
                      className="option-button-kids"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => completePuzzle(question.points)}
                    >
                      <span className="option-emoji">{getOptionEmoji(optIndex)}</span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCelebration && <CelebrationAnimation />}
      </div>
    );
  }

  // Completion Screen
  if (gameState === 'completed') {
    return (
      <div className="kids-completion">
        <div className="completion-celebration">
          <h2>🎉 Amazing! You Found the Treasure! 🎉</h2>
          <div className="reward-display">
            <div className="stars-earned">🌟 You earned {stars} stars!</div>
            <div className="treasure-found">🎁 You found: {currentStory.treasure}</div>
          </div>
          <motion.button 
            onClick={() => setGameState('selecting')} 
            className="continue-button-kids"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🗺️ Explore More Adventures!
          </motion.button>
        </div>
        <CelebrationAnimation />
      </div>
    );
  }

  return <div className="loading-kids">Loading your adventure... ✨</div>;
};

// Helper functions
const getKidFriendlyTitle = (storyId) => {
  const titles = {
    'kannauj-legacy': 'The Lost Golden City',
    'coronation-glory': 'The Lion King\'s Crown',
    'warrior-kings': 'The Brave Knight\'s Sword',
    'music-art': 'The Dancing Colors',
    'court-life': 'The Secret Queen\'s Palace',
    'royal-sports': 'The Princess Polo Game',
    'royal-patronage': 'The King\'s Music Party',
    'divine-power': 'The Magic Goddesses',
    'royal-hunts': 'The Desert Safari',
    'court-culture': 'The Wise Storyteller'
  };
  return titles[storyId] || 'Amazing Adventure';
};

const getKidFriendlyDescription = (storyId) => {
  const descriptions = {
    'kannauj-legacy': 'Find the hidden city of gold!',
    'coronation-glory': 'Help crown the new lion king!',
    'warrior-kings': 'Join the brave knight on an adventure!',
    'music-art': 'Watch colors dance to music!',
    'court-life': 'Explore the secret queen\'s palace!',
    'royal-sports': 'Play polo with princesses!',
    'royal-patronage': 'Join the king\'s music party!',
    'divine-power': 'Meet magical goddesses!',
    'royal-hunts': 'Go on a desert safari!',
    'court-culture': 'Listen to wise stories!'
  };
  return descriptions[storyId] || 'An exciting adventure awaits!';
};

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

const getStoryTreasure = (storyId) => {
  const treasures = {
    'kannauj-legacy': 'Golden City Map',
    'coronation-glory': 'Royal Crown',
    'warrior-kings': 'Magic Sword',
    'music-art': 'Colorful Paintbrush',
    'court-life': 'Queen\'s Jewel',
    'royal-sports': 'Golden Polo Mallet',
    'royal-patronage': 'Music Note Crystal',
    'divine-power': 'Goddess Amulet',
    'royal-hunts': 'Desert Compass',
    'court-culture': 'Storyteller\'s Quill'
  };
  return treasures[storyId] || 'Special Treasure';
};

const convertToKidStory = (story) => {
  return story.split('.')[0] + ". This is an amazing adventure! Can you help solve the mystery?";
};

const convertToKidQuestion = (question) => {
  const kidQuestions = {
    "In which year did the Rathores flee Kannauj after Jayachand's defeat?": 
    "When did the brave knights leave the golden city?",
    "Which city did the Rathores establish after their exile from Kannauj?": 
    "Where did they build their new magical city?",
    "What materials were used to create this masterpiece?": 
    "What magical things were used to make this painting?"
  };
  return kidQuestions[question] || question;
};

const getOptionEmoji = (index) => {
  const emojis = ['🔸', '🔹', '🔺', '🔻'];
  return emojis[index] || '✅';
};

export default KidsGameEngine;