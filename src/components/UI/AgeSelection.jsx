import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AgeSelection = ({ onAgeSelect }) => {
  const [selectedAge, setSelectedAge] = useState(null);

  const ageGroups = [
    {
      id: 'kids',
      title: 'Young Explorer',
      ageRange: '5-12 years',
      description: 'Fun treasure hunts with colorful adventures!',
      icon: '🧒',
      features: ['Treasure Maps', 'Fun Animations', 'Easy Puzzles', 'Star Rewards'],
      color: '#FF6B6B'
    },
    {
      id: 'adults',
      title: 'Art Detective',
      ageRange: '13-59 years',
      description: 'Solve mysteries and become an art expert!',
      icon: '🕵️',
      features: ['Complex Puzzles', 'Historical Challenges', 'Leaderboards', 'Achievements'],
      color: '#4ECDC4'
    },
    {
      id: 'seniors',
      title: 'Cultural Explorer',
      ageRange: '60+ years',
      description: 'Relaxed journey through heritage and stories',
      icon: '👴',
      features: ['Relaxed Pace', 'Audio Stories', 'Memory Games', 'Large Text'],
      color: '#45B7D1'
    }
  ];

  const handleSelect = (ageGroup) => {
    setSelectedAge(ageGroup);
    setTimeout(() => {
      onAgeSelect(ageGroup.id);
    }, 800);
  };

  return (
    <div className="age-selection">
      <motion.div
        className="selection-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Welcome to Mehrangarh Art Explorer!</h1>
        <p>Choose your adventure style based on your age group</p>
      </motion.div>

      <div className="age-groups">
        {ageGroups.map((group, index) => (
          <motion.div
            key={group.id}
            className={`age-card ${selectedAge?.id === group.id ? 'selected' : ''}`}
            style={{ '--accent-color': group.color }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            onClick={() => handleSelect(group)}
          >
            <div className="card-header">
              <span className="age-icon">{group.icon}</span>
              <div className="age-info">
                <h3>{group.title}</h3>
                <span className="age-range">{group.ageRange}</span>
              </div>
            </div>
            
            <p className="age-description">{group.description}</p>
            
            <div className="age-features">
              {group.features.map((feature, idx) => (
                <span key={idx} className="feature-tag">✓ {feature}</span>
              ))}
            </div>

            {selectedAge?.id === group.id && (
              <motion.div 
                className="selection-confirmation"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                🎉 Great choice! Starting your adventure...
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {!selectedAge && (
        <motion.div 
          className="selection-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>💡 Your choice will customize the game experience just for you!</p>
        </motion.div>
      )}
    </div>
  );
};

export default AgeSelection;