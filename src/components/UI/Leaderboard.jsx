import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBackend } from '../../hooks/useBackend';

const Leaderboard = ({ ageGroup = 'all' }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getLeaderboard } = useBackend();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard('score', 10);
        
        // Handle different data structures
        let leaderboardData = [];
        
        if (Array.isArray(data)) {
          // Data is already an array
          leaderboardData = data;
        } else if (data && typeof data === 'object') {
          // Data might be an object with a data property
          leaderboardData = data.data || data.leaderboard || [];
        }
        
        // Ensure we have an array and filter by age group if needed
        if (Array.isArray(leaderboardData)) {
          if (ageGroup !== 'all') {
            leaderboardData = leaderboardData.filter(user => 
              user.ageGroup === ageGroup || user.gameProgress?.ageGroup === ageGroup
            );
          }
          
          // Sort by score and take top 10
          leaderboardData = leaderboardData
            .sort((a, b) => {
              const scoreA = a.totalScore || a.gameProgress?.totalScore || 0;
              const scoreB = b.totalScore || b.gameProgress?.totalScore || 0;
              return scoreB - scoreA;
            })
            .slice(0, 10);
        } else {
          leaderboardData = [];
        }
        
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [ageGroup, getLeaderboard]);

  const getScore = (user) => {
    return user.totalScore || user.gameProgress?.totalScore || 0;
  };

  const getUsername = (user) => {
    return user.username || `Explorer${user._id?.slice(-4) || '0000'}`;
  };

  const getLevel = (user) => {
    const score = getScore(user);
    return Math.floor(score / 100) + 1;
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <h3>🏆 Leaderboard</h3>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard {ageGroup !== 'all' ? `- ${ageGroup}` : ''}</h3>
      
      {leaderboard.length === 0 ? (
        <div className="no-data">
          <p>No scores yet. Be the first to play!</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user._id || user.userId || index}
              className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="rank">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              
              <div className="user-info">
                <span className="username">{getUsername(user)}</span>
                <span className="level">Level {getLevel(user)}</span>
              </div>
              
              <div className="score">
                {getScore(user).toLocaleString()} pts
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;