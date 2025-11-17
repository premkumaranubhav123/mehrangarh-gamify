import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementsData } from '../../data/achievements';

const AchievementSystem = ({ currentAchievements, onNewAchievement }) => {
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check for new achievements
    const newAchievements = achievementsData.filter(achievement => 
      achievement.unlockCondition() && 
      !currentAchievements.find(a => a.id === achievement.id)
    );

    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        onNewAchievement(achievement);
        showAchievementNotification(achievement);
      });
    }
  }, [currentAchievements, onNewAchievement]);

  const showAchievementNotification = (achievement) => {
    setRecentAchievements(prev => [achievement, ...prev.slice(0, 2)]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const getAchievementProgress = (achievement) => {
    return achievement.getProgress ? achievement.getProgress() : 0;
  };

  return (
    <div className="achievement-system">
      {/* Achievement Notifications */}
      <AnimatePresence>
        {showNotification && recentAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className="achievement-notification"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="notification-content">
              <span className="achievement-icon">{achievement.icon}</span>
              <div className="notification-text">
                <strong>Achievement Unlocked!</strong>
                <span>{achievement.title}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Achievement Gallery */}
      <div className="achievement-gallery">
        <h3>🏆 Detective Achievements</h3>
        <div className="achievements-grid">
          {achievementsData.map(achievement => {
            const unlocked = currentAchievements.find(a => a.id === achievement.id);
            const progress = getAchievementProgress(achievement);
            
            return (
              <motion.div
                key={achievement.id}
                className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="achievement-icon">
                  {unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  {!unlocked && achievement.getProgress && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <span className="progress-text">{progress}%</span>
                    </div>
                  )}
                  {unlocked && (
                    <span className="unlocked-date">
                      Unlocked: {achievement.unlockedAt}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;