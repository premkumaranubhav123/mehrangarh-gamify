// src/components/UI/CollectibleTreasures.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CollectibleTreasures = ({ treasures = [] }) => {
  if (treasures.length === 0) return null;

  return (
    <motion.div 
      className="collectible-treasures"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>🎒 Your Treasure Collection</h3>
      <div className="treasures-grid">
        <AnimatePresence>
          {treasures.map((treasure, index) => (
            <motion.div
              key={treasure.id}
              className="treasure-item"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="treasure-icon">{treasure.icon}</div>
              <div className="treasure-info">
                <div className="treasure-name">{treasure.name}</div>
                <div className="treasure-description">{treasure.description}</div>
              </div>
              
              {/* Shine effect */}
              <motion.div
                className="treasure-shine"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CollectibleTreasures;