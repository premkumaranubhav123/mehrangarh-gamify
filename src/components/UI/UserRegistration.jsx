import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import './UserRegistration.css';

const UserRegistration = ({ onComplete, preSelectedAge, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    ageGroup: preSelectedAge || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser } = useGame();

  useEffect(() => {
    if (preSelectedAge) {
      setFormData(prev => ({ ...prev, ageGroup: preSelectedAge }));
    }
  }, [preSelectedAge]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.ageGroup) return;

    setIsSubmitting(true);
    console.log('📝 Submitting registration:', formData);
    
    try {
      await registerUser(formData);
      console.log('✅ Registration successful');
      onComplete();
    } catch (error) {
      console.error('❌ Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAgeGroupDisplay = () => {
    const ageGroups = {
      kids: { icon: '🧒', title: 'Young Explorer', color: '#FF6B6B' },
      adults: { icon: '👨‍🎓', title: 'History Enthusiast', color: '#4ECDC4' },
      seniors: { icon: '👴', title: 'Leisure Explorer', color: '#45B7D1' }
    };
    return ageGroups[formData.ageGroup] || { icon: '❓', title: 'Unknown', color: '#666' };
  };

  const ageInfo = getAgeGroupDisplay();

  return (
    <motion.div 
      className="registration-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="registration-card">
        {/* Header */}
        <motion.div 
          className="registration-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="header-icon">🎮</div>
          <h1>Join the Adventure!</h1>
          <p>Complete your profile to start exploring Mehrangarh Fort</p>
        </motion.div>

        {/* Age Group Display */}
        <motion.div 
          className="age-group-display"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ borderColor: ageInfo.color }}
        >
          <div className="age-icon">{ageInfo.icon}</div>
          <div className="age-info">
            <h3>{ageInfo.title}</h3>
            <p>Adventure Style Selected</p>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="registration-form"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="form-group">
            <label htmlFor="username">Explorer Name *</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your explorer name..."
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              maxLength={20}
            />
            <div className="character-count">{formData.username.length}/20</div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com (optional)"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <div className="input-hint">We'll save your progress across devices</div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <motion.button 
              type="submit"
              className="submit-btn"
              disabled={!formData.username.trim() || isSubmitting}
              whileHover={{ scale: !formData.username.trim() || isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: !formData.username.trim() || isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Creating Adventure...
                </>
              ) : (
                <>
                  🚀 Start Your Journey!
                </>
              )}
            </motion.button>

            <button 
              type="button" 
              className="back-btn"
              onClick={onBack}
            >
              ← Choose Different Style
            </button>
          </div>
        </motion.form>

        {/* Features List */}
        <motion.div 
          className="features-list"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4>What you'll get:</h4>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🌟</span>
              <span>Personalized Adventure</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💾</span>
              <span>Progress Saving</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <span>Achievements</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Game Statistics</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserRegistration;