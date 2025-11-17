// src/components/Game/TreasureHuntGame.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import StarRewardSystem from '../UI/StarRewardSystem';
import CelebrationAnimation from '../UI/CelebrationAnimation';
import CollectibleTreasures from '../UI/CollectibleTreasures';

const TreasureHuntGame = ({ story, onComplete, onBack }) => {
  const { state, dispatch } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [foundClues, setFoundClues] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [collectedTreasures, setCollectedTreasures] = useState([]);
  const [cluePositions, setCluePositions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer for challenge
  const [showTimer, setShowTimer] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentPainting = story.paintings[0];

  useEffect(() => {
    // Initialize treasure hunt
    setCurrentStep(0);
    setFoundClues([]);
    setStarsEarned(0);
    setAnsweredQuestions([]);
    setCurrentQuestion(0);
    setStreak(0);
    
    // Generate strategic clue positions based on painting content
    const positions = generateStrategicCluePositions(currentPainting.clues.length);
    setCluePositions(positions);
  }, [story]);

  // Timer effect for challenge mode
  useEffect(() => {
    if (showTimer && timeLeft > 0 && currentStep === 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showTimer, timeLeft, currentStep]);

  const generateStrategicCluePositions = (clueCount) => {
    // Strategic positions that make sense for the painting layout
    const basePositions = [
      { left: '25%', top: '35%' },   // Top-left area
      { left: '65%', top: '40%' },   // Top-right area  
      { left: '45%', top: '60%' },   // Center area
      { left: '30%', top: '70%' },   // Bottom-left area
      { left: '75%', top: '65%' },   // Bottom-right area
      { left: '15%', top: '50%' },   // Left area
      { left: '85%', top: '45%' },   // Right area
      { left: '50%', top: '25%' },   // Top-center area
      { left: '55%', top: '75%' },   // Bottom-center area
      { left: '40%', top: '45%' }    // Center-left area
    ];
    
    return basePositions.slice(0, clueCount).map(pos => ({
      ...pos,
      rotation: Math.random() * 360
    }));
  };

  const handleClueFound = (clueIndex) => {
    if (!foundClues.includes(clueIndex)) {
      const newFoundClues = [...foundClues, clueIndex];
      setFoundClues(newFoundClues);
      
      // Award stars for finding clues with streak bonus
      const streakBonus = Math.floor(streak / 2);
      const starsToAdd = 1 + streakBonus;
      setStarsEarned(prev => prev + starsToAdd);
      setStreak(prev => prev + 1);
      
      // Collect treasure for each clue
      const treasureIcons = ['🔍', '💎', '🗝️', '📜', '🏆', '👑', '💍', '🔮'];
      const newTreasure = {
        id: Date.now() + clueIndex,
        name: `Mystery Clue ${clueIndex + 1}`,
        icon: treasureIcons[clueIndex % treasureIcons.length],
        description: `You discovered: "${currentPainting.clues[clueIndex]}"`,
        rarity: getRarityLevel(clueIndex)
      };
      setCollectedTreasures(prev => [...prev, newTreasure]);
      
      // Play success sound
      playSound('success');
      
      // Show mini celebration for each clue found
      if (streakBonus > 0) {
        setTimeout(() => {
          playSound('bonus');
        }, 500);
      }

      // If all clues found, move to questions
      if (newFoundClues.length === currentPainting.clues.length) {
        setTimeout(() => {
          setCurrentStep(1);
          playSound('levelUp');
          // Bonus for finding all clues quickly
          if (timeLeft > 300) { // More than 5 minutes left
            const timeBonus = Math.floor((timeLeft - 300) / 30);
            setStarsEarned(prev => prev + timeBonus);
          }
        }, 1500);
      }
    }
  };

  const handleAnswerQuestion = (questionIndex, selectedOption) => {
    const question = currentPainting.questions[questionIndex];
    const isCorrect = selectedOption === question.correct;
    
    if (isCorrect) {
      // Award points and stars with difficulty multiplier
      const difficultyMultiplier = getDifficultyMultiplier(story.difficulty);
      const pointsEarned = Math.floor(question.points * difficultyMultiplier);
      dispatch({ type: 'ADD_SCORE', payload: pointsEarned });
      
      // Bonus stars for consecutive correct answers
      const consecutiveBonus = answeredQuestions.length * 0.5;
      const starsToAdd = 2 + consecutiveBonus;
      setStarsEarned(prev => prev + starsToAdd);
      setAnsweredQuestions(prev => [...prev, questionIndex]);
      
      // Collect treasure for correct answer
      const knowledgeIcons = ['⭐', '🧠', '📚', '🎓', '🏅', '💡', '🌟', '✨'];
      const newTreasure = {
        id: Date.now() + 100 + questionIndex,
        name: `Knowledge Gem ${questionIndex + 1}`,
        icon: knowledgeIcons[questionIndex % knowledgeIcons.length],
        description: `Mastered: ${question.question.substring(0, 50)}...`,
        rarity: 'epic'
      };
      setCollectedTreasures(prev => [...prev, newTreasure]);
      
      playSound('correct');
      
      // Move to next question or complete
      if (questionIndex < currentPainting.questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
        }, 1200);
      } else {
        // All questions completed - Big celebration!
        setTimeout(() => {
          setShowCelebration(true);
          playSound('victory');
          
          // Final score calculation
          const perfectBonus = foundClues.length === currentPainting.clues.length ? 50 : 0;
          const questionBonus = answeredQuestions.length === currentPainting.questions.length ? 100 : 0;
          const finalStars = starsEarned + perfectBonus + questionBonus;
          
          setTimeout(() => {
            onComplete(finalStars);
          }, 4000);
        }, 1500);
      }
    } else {
      // Penalty for wrong answer with decreasing penalty
      const penalty = Math.max(10, 30 - (answeredQuestions.length * 5));
      dispatch({ type: 'ADD_SCORE', payload: -penalty });
      setStreak(0); // Reset streak on wrong answer
      playSound('wrong');
      
      // Show encouraging message
      setTimeout(() => {
        playSound('encouragement');
      }, 1000);
    }
  };

  const useHint = () => {
    if (state.score >= (state.ageConfig?.hintCost || 25)) {
      dispatch({ type: 'USE_HINT' });
      setShowHint(true);
      playSound('hint');
      
      // Reveal a random unfound clue
      const unfoundClues = currentPainting.clues
        .map((_, index) => index)
        .filter(index => !foundClues.includes(index));
      
      if (unfoundClues.length > 0) {
        const randomClue = unfoundClues[Math.floor(Math.random() * unfoundClues.length)];
        setTimeout(() => {
          handleClueFound(randomClue);
        }, 1000);
      }
      
      setTimeout(() => setShowHint(false), 3000);
    } else {
      playSound('error');
    }
  };

  const handleTimeUp = () => {
    playSound('timeUp');
    // Auto-reveal remaining clues but with penalty
    currentPainting.clues.forEach((_, index) => {
      if (!foundClues.includes(index)) {
        setTimeout(() => {
          handleClueFound(index);
        }, index * 500);
      }
    });
  };

  const toggleTimer = () => {
    setShowTimer(!showTimer);
    if (!showTimer) {
      setTimeLeft(600); // Reset to 10 minutes
    }
  };

  const playSound = (type) => {
    // Sound effects mapping - in real app, use actual audio files
    const soundMessages = {
      success: '🎵 Positive chime!',
      error: '🎵 Error sound',
      click: '🎵 Click sound',
      victory: '🎵 Victory fanfare!',
      clueFound: '🎵 Discovery sound!',
      levelUp: '🎵 Level up!',
      correct: '🎵 Correct answer!',
      wrong: '🎵 Try again sound',
      hint: '🎵 Hint revealed',
      bonus: '🎵 Bonus earned!',
      timeUp: '🎵 Time\'s up!',
      encouragement: '🎵 You can do it!'
    };
    console.log(soundMessages[type] || '🎵 Game sound');
  };

  const getClueEmoji = (clueIndex) => {
    const emojis = ['🔍', '🔎', '💎', '🌟', '🎯', '🗝️', '📜', '🏆', '👑', '💍'];
    return emojis[clueIndex % emojis.length];
  };

  const getDifficultyMultiplier = (difficulty) => {
    const multipliers = {
      'beginner': 1.0,
      'intermediate': 1.2,
      'advanced': 1.5,
      'expert': 2.0
    };
    return multipliers[difficulty] || 1.0;
  };

  const getRarityLevel = (index) => {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    return rarities[Math.min(index, rarities.length - 1)];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="treasure-hunt-game">
      {showCelebration && (
        <CelebrationAnimation 
          type="treasure" 
          duration={4000}
          message={`🎉 Amazing! You completed ${story.title}! 🎉`}
        />
      )}
      
      <div className="treasure-header">
        <button onClick={onBack} className="back-button">
          ← Back to Map
        </button>
        
        <h2>🔍 {story.title} Treasure Hunt</h2>
        
        <div className="treasure-stats">
          <span className="stat-item">
            ⭐ {starsEarned} Stars
            {streak > 2 && (
              <motion.span 
                className="streak-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🔥 {streak}
              </motion.span>
            )}
          </span>
          <span className="stat-item">
            🔍 {foundClues.length}/{currentPainting.clues.length} Clues
          </span>
          <span className="stat-item">
            💎 {collectedTreasures.length} Treasures
          </span>
          
          {/* Timer Toggle */}
          <button 
            onClick={toggleTimer}
            className={`timer-toggle ${showTimer ? 'active' : ''}`}
          >
            ⏱️ {showTimer ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Timer Display */}
      {showTimer && (
        <motion.div 
          className="timer-display"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="timer-progress">
            <motion.div 
              className="timer-fill"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 600) * 100}%` }}
              transition={{ duration: 1 }}
              style={{
                background: timeLeft < 60 ? 'linear-gradient(135deg, #FF6B6B, #FF5252)' : 
                           timeLeft < 180 ? 'linear-gradient(135deg, #FFA500, #FF8C00)' :
                           'linear-gradient(135deg, #4ECDC4, #44A08D)'
              }}
            />
          </div>
          <span className="timer-text">
            {formatTime(timeLeft)}
            {timeLeft < 60 && ' ⚡'}
          </span>
        </motion.div>
      )}

      <div className="treasure-content">
        <AnimatePresence mode="wait">
          {/* Step 1: Find Clues in the Painting */}
          {currentStep === 0 && (
            <motion.div
              key="clue-finding"
              className="clue-finding-step"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h3
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🗺️ Find the Hidden Clues!
              </motion.h3>
              
              <motion.p
                className="step-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Click on the sparkling spots in the painting to discover clues about this amazing story!
              </motion.p>
              
              <div className="painting-container">
                <motion.img 
                  src={currentPainting.imageUrl} 
                  alt={currentPainting.title}
                  className="treasure-painting"
                  initial={{ scale: 0.9, rotate: -2 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                />
                
                {/* Interactive clue areas */}
                <div className="clue-areas">
                  {currentPainting.clues.map((clue, index) => (
                    <motion.button
                      key={index}
                      className={`clue-spot ${foundClues.includes(index) ? 'found' : ''} ${getRarityLevel(index)}`}
                      onClick={() => handleClueFound(index)}
                      style={{
                        left: cluePositions[index]?.left || '50%',
                        top: cluePositions[index]?.top || '50%'
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: foundClues.includes(index) ? 1.3 : 1,
                        rotate: foundClues.includes(index) ? 0 : cluePositions[index]?.rotation || 0,
                        y: foundClues.includes(index) ? [0, -10, 0] : 0
                      }}
                      whileHover={{ 
                        scale: foundClues.includes(index) ? 1.4 : 1.2,
                        rotate: foundClues.includes(index) ? 0 : 20
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        delay: index * 0.1,
                        y: {
                          duration: 2,
                          repeat: foundClues.includes(index) ? Infinity : 0,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      {foundClues.includes(index) ? '✅' : getClueEmoji(index)}
                      
                      {/* Sparkle effect for unfound clues */}
                      {!foundClues.includes(index) && (
                        <motion.div
                          className="clue-sparkle"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.div 
                className="clues-list"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h4>🗒️ Clues to Find:</h4>
                {currentPainting.clues.map((clue, index) => (
                  <motion.div 
                    key={index} 
                    className={`clue-item ${foundClues.includes(index) ? 'found' : ''} ${getRarityLevel(index)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    <span className="clue-icon">
                      {foundClues.includes(index) ? '✅' : '🔍'}
                    </span>
                    <span className="clue-text">{clue}</span>
                    <span className="clue-rarity">{getRarityLevel(index)}</span>
                    {foundClues.includes(index) && (
                      <motion.span 
                        className="sparkle"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        ✨
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <div className="action-buttons">
                <motion.button 
                  onClick={useHint} 
                  className="hint-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={state.score < (state.ageConfig?.hintCost || 25)}
                >
                  💡 Need a Hint? ({state.ageConfig?.hintCost || 25} points)
                </motion.button>

                {showTimer && timeLeft < 180 && (
                  <motion.div
                    className="time-warning"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    ⚡ Hurry! {formatTime(timeLeft)} remaining!
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    className="hint-bubble"
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    🧩 Look carefully at the painting! The clues are hiding in special places!
                    Try clicking on interesting details you notice!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress indicator */}
              <motion.div 
                className="progress-indicator"
                initial={{ width: 0 }}
                animate={{ width: `${(foundClues.length / currentPainting.clues.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              >
                <span>
                  Progress: {foundClues.length}/{currentPainting.clues.length}
                  {foundClues.length === currentPainting.clues.length && ' 🎉'}
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Answer Questions */}
          {currentStep === 1 && (
            <motion.div
              key="question-step"
              className="question-step"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                🧠 Time to Test Your Knowledge!
              </motion.h3>
              
              <motion.p
                className="step-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You found all the clues! Now answer these questions to show what you've learned!
              </motion.p>
              
              <div className="questions-container">
                <motion.div 
                  key={currentQuestion}
                  className="treasure-question"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="question-header">
                    <h4>❓ {currentPainting.questions[currentQuestion].question}</h4>
                    <span className="question-points">
                      +{Math.floor(currentPainting.questions[currentQuestion].points * getDifficultyMultiplier(story.difficulty))} pts
                    </span>
                  </div>
                  
                  <div className="treasure-options">
                    {currentPainting.questions[currentQuestion].options.map((option, optIndex) => (
                      <motion.button
                        key={optIndex}
                        onClick={() => handleAnswerQuestion(currentQuestion, optIndex)}
                        className={`treasure-option ${
                          answeredQuestions.includes(currentQuestion) 
                            ? (optIndex === currentPainting.questions[currentQuestion].correct ? 'correct' : 'incorrect')
                            : ''
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={answeredQuestions.includes(currentQuestion)}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: optIndex * 0.1 }}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="option-text">{option}</span>
                        {answeredQuestions.includes(currentQuestion) && 
                         optIndex === currentPainting.questions[currentQuestion].correct && (
                          <motion.span 
                            className="correct-indicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            ✅
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Question progress */}
              <div className="question-progress">
                <span>
                  Question {currentQuestion + 1} of {currentPainting.questions.length}
                  {answeredQuestions.includes(currentQuestion) && ' ✓'}
                </span>
                <div className="progress-dots">
                  {currentPainting.questions.map((_, index) => (
                    <motion.div 
                      key={index}
                      className={`dot ${index <= currentQuestion ? 'active' : ''} ${
                        answeredQuestions.includes(index) ? 'correct' : ''
                      }`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collectible Treasures Display */}
      {collectedTreasures.length > 0 && (
        <CollectibleTreasures treasures={collectedTreasures} />
      )}

      {/* Story Panel */}
      <motion.div 
        className="story-panel kids"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h4>📖 The Story:</h4>
        <p>{currentPainting.story.split('\n\n')[0]}</p>
        {currentPainting.story.split('\n\n').length > 1 && (
          <motion.button
            className="read-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📖 Read Full Story
          </motion.button>
        )}
      </motion.div>

      {/* Star Reward Display */}
      <StarRewardSystem 
        currentStars={starsEarned} 
        maxStars={currentPainting.clues.length + currentPainting.questions.length * 2} 
        size="large"
      />

      {/* Difficulty Badge */}
      <motion.div 
        className="difficulty-badge"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <span className={`badge ${story.difficulty}`}>
          {story.difficulty.toUpperCase()} LEVEL
        </span>
      </motion.div>
    </div>
  );
};

export default TreasureHuntGame;