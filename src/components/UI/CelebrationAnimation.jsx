// src/components/UI/CelebrationAnimation.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CelebrationAnimation = ({ 
  type = 'stars', 
  duration = 3000, 
  onComplete,
  message = "🎉 Amazing! Treasure Found! 🎉"
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate celebration particles based on type
    const particleCount = type === 'treasure' ? 30 : 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      type: getParticleType(type),
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1.5,
      size: 1 + Math.random() * 1.5
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, duration, onComplete]);

  const getParticleType = (type) => {
    const types = {
      stars: ['⭐', '🌟', '✨', '💫', '☀️'],
      treasure: ['💎', '🎁', '🏆', '👑', '💰', '💍', '🔑'],
      confetti: ['🎉', '🎊', '🥳', '🎈', '🎯'],
      victory: ['🏅', '🎖️', '🥇', '🎪', '🚀']
    };
    const particleTypes = types[type] || types.stars;
    return particleTypes[Math.floor(Math.random() * particleTypes.length)];
  };

  const getCelebrationColor = (type) => {
    const colors = {
      stars: 'linear-gradient(135deg, #FFD700, #FFA500)',
      treasure: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
      confetti: 'linear-gradient(135deg, #667eea, #764ba2)',
      victory: 'linear-gradient(135deg, #f093fb, #f5576c)'
    };
    return colors[type] || colors.stars;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="celebration-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background overlay with type-specific color */}
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            style={{
              background: getCelebrationColor(type)
            }}
          />
          
          {/* Main celebration message */}
          <motion.div
            className="celebration-message"
            initial={{ scale: 0, rotate: -180, y: 100 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              y: 0,
              y: [0, -10, 0]
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: 0.2,
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              background: getCelebrationColor(type)
            }}
          >
            {message}
          </motion.div>

          {/* Floating particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="celebration-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                fontSize: `${particle.size}rem`
              }}
              initial={{ 
                scale: 0,
                y: 100,
                opacity: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0.8, 0],
                y: [100, -50, -100],
                opacity: [0, 1, 0.8, 0],
                rotate: [0, 180, 360],
                x: [0, Math.random() * 100 - 50, 0]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut"
              }}
            >
              {particle.type}
            </motion.div>
          ))}

          {/* Sparkle effects */}
          <motion.div
            className="sparkle-effect"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Burst effect */}
          <motion.div
            className="burst-effect"
            initial={{ scale: 0 }}
            animate={{ scale: 10, opacity: [0.8, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Floating text effects */}
          <motion.div
            className="floating-text"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -50, opacity: [0, 1, 0] }}
            transition={{ delay: 0.5, duration: 2 }}
          >
            🎊 Yay! You did it! 🎊
          </motion.div>

          <motion.div
            className="floating-text"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -30, opacity: [0, 1, 0] }}
            transition={{ delay: 1, duration: 2 }}
          >
            🌟 Super Explorer! 🌟
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationAnimation;