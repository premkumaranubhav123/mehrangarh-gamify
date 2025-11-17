// src/components/UI/StarRewardSystem.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StarRewardSystem = ({ currentStars = 0, maxStars = 10, size = 'medium' }) => {
  const starSizes = {
    small: '1.5rem',
    medium: '2rem',
    large: '3rem'
  };

  const starSize = starSizes[size] || starSizes.medium;

  return (
    <div className="star-reward-system">
      <div className="stars-container">
        <AnimatePresence>
          {Array.from({ length: maxStars }, (_, index) => (
            <motion.div
              key={index}
              className={`star ${index < currentStars ? 'active' : 'inactive'}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: index < currentStars ? [0, -10, 0] : 0
              }}
              transition={{ 
                delay: index * 0.1,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }
              }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              style={{ fontSize: starSize }}
            >
              {index < currentStars ? '⭐' : '☆'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="stars-count"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentStars} / {maxStars} Stars
      </motion.div>
      
      {/* Progress bar */}
      <div className="stars-progress">
        <motion.div 
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStars / maxStars) * 100}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  );
};

export default StarRewardSystem;