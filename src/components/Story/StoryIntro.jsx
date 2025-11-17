import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StoryIntro = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const storySteps = [
    {
      title: "Welcome to Mehrangarh Fort",
      content: "Step into the magnificent world of Marwar's royal heritage, where every painting tells a story of valor, culture, and artistry.",
      image: "🏰"
    },
    {
      title: "The Rathore Legacy",
      content: "For centuries, the Rathore rulers patronized arts, resulting in one of India's most magnificent collections of paintings.",
      image: "🎨"
    },
    {
      title: "Your Mission",
      content: "As an art explorer, you'll uncover hidden stories, solve puzzles, and discover the secrets behind these masterpieces.",
      image: "🔍"
    }
  ];

  const nextStep = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="story-intro">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="story-step"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <div className="story-image">{storySteps[currentStep].image}</div>
          <h2>{storySteps[currentStep].title}</h2>
          <p>{storySteps[currentStep].content}</p>
          <button onClick={nextStep} className="continue-button">
            {currentStep < storySteps.length - 1 ? 'Continue' : 'Begin Exploration'}
          </button>
        </motion.div>
      </AnimatePresence>
      
      <div className="progress-dots">
        {storySteps.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentStep ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryIntro;