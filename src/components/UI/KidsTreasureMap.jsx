// src/components/UI/KidsTreasureMap.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KidsTreasureMap = ({ stories, completedStories, onStorySelect, stars, collectedItems }) => {
  const [hoveredIsland, setHoveredIsland] = useState(null);

  const getIslandPosition = (index, total) => {
    const positions = [
      { top: '15%', left: '10%' },
      { top: '55%', left: '20%' },
      { top: '30%', left: '40%' },
      { top: '65%', left: '50%' },
      { top: '20%', left: '70%' },
      { top: '50%', left: '80%' },
      { top: '35%', left: '25%' },
      { top: '60%', left: '35%' },
      { top: '25%', left: '55%' },
      { top: '45%', left: '65%' }
    ];
    return positions[index] || { top: '50%', left: '50%' };
  };

  const getIslandSize = (difficulty) => {
    const sizes = {
      'beginner': '80px',
      'intermediate': '90px',
      'advanced': '100px',
      'expert': '110px'
    };
    return sizes[difficulty] || '80px';
  };

  const getIslandColor = (storyId) => {
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

  return (
    <div className="treasure-map-container">
      <div className="map-background">
        {/* Animated Ocean */}
        <motion.div 
          className="ocean"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Wave animations */}
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </motion.div>
        
        {/* Treasure islands */}
        {stories.map((story, index) => {
          const isCompleted = completedStories.includes(story.id);
          const isHovered = hoveredIsland === story.id;
          const position = getIslandPosition(index, stories.length);
          const size = getIslandSize(story.difficulty);
          const color = getIslandColor(story.id);

          return (
            <motion.div
              key={story.id}
              className={`treasure-island ${story.difficulty} ${
                isCompleted ? 'discovered' : 'undiscovered'
              } ${isHovered ? 'hovered' : ''}`}
              style={{
                ...position,
                '--island-color': color,
                '--island-size': size
              }}
              initial={{ scale: 0, rotate: -180, y: 100 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                y: 0,
                y: isHovered ? [-5, 5, -5] : [0, -3, 0]
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                delay: index * 0.2,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              onHoverStart={() => setHoveredIsland(story.id)}
              onHoverEnd={() => setHoveredIsland(null)}
              onClick={() => onStorySelect(story)}
              whileHover={{ 
                scale: 1.2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="island-content">
                <motion.div 
                  className="island-icon"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {getIslandEmoji(story.id)}
                </motion.div>
                
                {/* Island glow effect */}
                <motion.div 
                  className="island-glow"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Treasure chest for completed islands */}
                <AnimatePresence>
                  {isCompleted && (
                    <motion.div 
                      className="treasure-chest"
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: -20 }}
                      whileHover={{ scale: 1.3, rotate: 10 }}
                    >
                      🎁
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Difficulty stars */}
                <div className="difficulty-stars">
                  {'⭐'.repeat(getDifficultyStars(story.difficulty))}
                </div>
              </div>
              
              {/* Island label */}
              <motion.div 
                className="island-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? -5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {story.title}
              </motion.div>
              
              {/* Connection paths */}
              {index > 0 && (
                <motion.div 
                  className="island-path"
                  style={getPathStyle(index, stories.length)}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.3 + 0.5, duration: 0.5 }}
                />
              )}
            </motion.div>
          );
        })}
        
        {/* Player ship */}
        <motion.div 
          className="player-ship"
          animate={{
            x: ['0%', '5%', '0%', '-5%', '0%'],
            y: ['0%', '-3%', '0%', '2%', '0%'],
            rotate: [-5, 5, -5, 5, -5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.2 }}
        >
          ⛵
          <motion.div 
            className="ship-wake"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Floating treasures in ocean */}
        <motion.div 
          className="floating-treasure treasure-1"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💎
        </motion.div>
        <motion.div 
          className="floating-treasure treasure-2"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🐚
        </motion.div>
      </div>
      
      {/* Map Legend */}
      <motion.div 
        className="map-legend"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <h4>🗺️ Map Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">🏝️</span>
            <span>New Adventure</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🎁</span>
            <span>Treasure Found</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⛵</span>
            <span>Your Ship</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⭐</span>
            <span>Difficulty Level</span>
          </div>
        </div>
      </motion.div>

      {/* Total Stars Display */}
      <motion.div 
        className="total-stars-display"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <span className="stars-count">⭐ {stars || 0}</span>
        <span>Total Stars Collected</span>
      </motion.div>
    </div>
  );
};

const getIslandEmoji = (storyId) => {
  const emojis = {
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
  return emojis[storyId] || '🗺️';
};

const getPathStyle = (index, total) => {
  const paths = [
    { width: '120px', transform: 'rotate(30deg)', left: '-100px', top: '30px' },
    { width: '100px', transform: 'rotate(-15deg)', left: '-80px', top: '10px' },
    { width: '130px', transform: 'rotate(45deg)', left: '-110px', top: '20px' },
    { width: '90px', transform: 'rotate(-30deg)', left: '-70px', top: '15px' },
    { width: '140px', transform: 'rotate(60deg)', left: '-120px', top: '25px' },
    { width: '110px', transform: 'rotate(-45deg)', left: '-90px', top: '18px' },
    { width: '95px', transform: 'rotate(15deg)', left: '-75px', top: '12px' },
    { width: '125px', transform: 'rotate(-60deg)', left: '-105px', top: '22px' },
    { width: '115px', transform: 'rotate(75deg)', left: '-95px', top: '28px' }
  ];
  return paths[index - 1] || { width: '100px', transform: 'rotate(0deg)' };
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

export default KidsTreasureMap;