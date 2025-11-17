import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PaintingPuzzle = ({ painting, onComplete, onUseHint }) => {
  const [currentClue, setCurrentClue] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  useEffect(() => {
    setCurrentClue(0);
    setShowStory(false);
    setPuzzleCompleted(false);
  }, [painting]);

  const revealClue = () => {
    if (currentClue < painting.clues.length - 1) {
      setCurrentClue(prev => prev + 1);
      onUseHint();
    }
  };

  const checkAnswer = (questionIndex, selectedOption) => {
    const question = painting.questions[questionIndex];
    if (selectedOption === question.correct) {
      setPuzzleCompleted(true);
      onComplete(question.points);
    } else {
      onComplete(-20);
    }
  };

  return (
    <div className="painting-puzzle">
      <div className="puzzle-header">
        <h3>{painting.title}</h3>
        <button 
          className="story-toggle"
          onClick={() => setShowStory(!showStory)}
        >
          {showStory ? 'Hide Story' : 'Reveal Story'}
        </button>
      </div>

      <AnimatePresence>
        {showStory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="story-panel"
          >
            <p>{painting.story}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="painting-container">
        <motion.img
          src={painting.imageUrl}
          alt={painting.title}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="clue-section">
          <h4>Current Clue:</h4>
          <p>{painting.clues[currentClue]}</p>
          {currentClue < painting.clues.length - 1 && (
            <button onClick={revealClue} className="hint-button">
              Need Another Hint? (-50 points)
            </button>
          )}
        </div>

        <div className="questions-section">
          {painting.questions.map((question, index) => (
            <div key={index} className="question-card">
              <h5>{question.question}</h5>
              <div className="options-grid">
                {question.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => checkAnswer(index, optIndex)}
                    disabled={puzzleCompleted}
                    className="option-button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaintingPuzzle;