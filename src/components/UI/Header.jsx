import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Leaderboard from './Leaderboard';
import './Header.css';

const Header = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('kids');

  return (
    <>
      <motion.header 
        className="app-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <div className="header-content">
          <div className="header-left">
            <h1>Mehrangarh Art Explorer</h1>
            <p className="header-subtitle">Discover the rich heritage of Marwar through interactive storytelling</p>
          </div>
          <div className="header-right">
            <button 
              className="leaderboard-btn"
              onClick={() => setShowLeaderboard(true)}
            >
              🏆 Leaderboard
            </button>
            <div className="header-stats">
              <div className="stat">🎮 Active Players</div>
              <div className="stat">⭐ Top Score: 1500</div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowLeaderboard(false)}
        >
          <motion.div 
            className="leaderboard-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>🏆 Top Explorers</h2>
              <button 
                className="close-btn"
                onClick={() => setShowLeaderboard(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="age-group-selector">
              <button 
                className={`age-tab ${selectedAgeGroup === 'kids' ? 'active' : ''}`}
                onClick={() => setSelectedAgeGroup('kids')}
              >
                👦 Kids
              </button>
              <button 
                className={`age-tab ${selectedAgeGroup === 'adults' ? 'active' : ''}`}
                onClick={() => setSelectedAgeGroup('adults')}
              >
                👨 Adults
              </button>
              <button 
                className={`age-tab ${selectedAgeGroup === 'seniors' ? 'active' : ''}`}
                onClick={() => setSelectedAgeGroup('seniors')}
              >
                👴 Seniors
              </button>
            </div>
            
            <Leaderboard ageGroup={selectedAgeGroup} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Header;