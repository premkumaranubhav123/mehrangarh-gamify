import React from 'react';
import { motion } from 'framer-motion';

const PerformanceMetrics = ({ 
  casesCompleted = 0, 
  totalScore = 0, 
  averageAccuracy = 0, 
  investigationTime = 0, 
  hintsUsed = 0,
  achievements = [],
  rank = 'Novice',
  skillBreakdown = {}
}) => {
  const getRankColor = (rank) => {
    const rankColors = {
      'Novice': '#95a5a6',
      'Investigator': '#3498db',
      'Detective': '#9b59b6',
      'Senior Detective': '#e74c3c',
      'Chief Inspector': '#f39c12',
      'Historical Scholar': '#27ae60'
    };
    return rankColors[rank] || '#95a5a6';
  };

  const calculateEfficiency = (time, cases) => {
    if (cases === 0) return 0;
    return Math.max(0, 100 - (time / cases) / 10);
  };

  const efficiency = calculateEfficiency(investigationTime, casesCompleted);

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h3>📊 Detective Performance Analytics</h3>
        <div 
          className="detective-rank"
          style={{ backgroundColor: getRankColor(rank) }}
        >
          {rank}
        </div>
      </div>

      <div className="metrics-grid">
        <motion.div 
          className="metric-card primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="metric-value">{casesCompleted}</div>
          <div className="metric-label">Cases Solved</div>
          <div className="metric-subtext">Historical Investigations</div>
        </motion.div>

        <motion.div 
          className="metric-card primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="metric-value">{totalScore}</div>
          <div className="metric-label">Total Score</div>
          <div className="metric-subtext">Detective Points</div>
        </motion.div>

        <motion.div 
          className="metric-card success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="metric-value">{averageAccuracy}%</div>
          <div className="metric-label">Accuracy Rate</div>
          <div className="metric-subtext">Case Solutions</div>
        </motion.div>

        <motion.div 
          className="metric-card warning"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="metric-value">{efficiency.toFixed(1)}%</div>
          <div className="metric-label">Efficiency</div>
          <div className="metric-subtext">Time Management</div>
        </motion.div>
      </div>

      <div className="detailed-metrics">
        <div className="metrics-row">
          <div className="time-metrics">
            <h4>⏱️ Time Analysis</h4>
            <div className="time-stats">
              <div className="time-stat">
                <span className="label">Total Investigation Time:</span>
                <span className="value">{Math.floor(investigationTime / 60)}m {investigationTime % 60}s</span>
              </div>
              <div className="time-stat">
                <span className="label">Average per Case:</span>
                <span className="value">
                  {casesCompleted > 0 ? Math.floor((investigationTime / casesCompleted) / 60) : 0}m 
                  {casesCompleted > 0 ? Math.floor((investigationTime / casesCompleted) % 60) : 0}s
                </span>
              </div>
              <div className="time-stat">
                <span className="label">Hints Used:</span>
                <span className="value">{hintsUsed}</span>
              </div>
            </div>
          </div>

          <div className="skill-metrics">
            <h4>🎯 Skill Breakdown</h4>
            <div className="skill-bars">
              {Object.entries(skillBreakdown).map(([skill, value]) => (
                <div key={skill} className="skill-bar">
                  <div className="skill-info">
                    <span className="skill-name">{skill}</span>
                    <span className="skill-value">{value}%</span>
                  </div>
                  <div className="skill-progress">
                    <div 
                      className="skill-progress-fill"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="achievements-showcase">
          <h4>🏆 Recent Achievements</h4>
          <div className="achievements-grid">
            {achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id || index}
                className="achievement-badge small"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="achievement-icon">{achievement.icon || '🏆'}</span>
                <div className="achievement-info">
                  <span className="achievement-title">{achievement.title || 'Achievement'}</span>
                  <span className="achievement-desc">{achievement.description || 'Description'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="performance-insights">
          <h4>💡 Performance Insights</h4>
          <div className="insights-list">
            {averageAccuracy >= 90 && (
              <div className="insight positive">
                <strong>Excellent Accuracy:</strong> Your case solutions show deep historical understanding.
              </div>
            )}
            {efficiency >= 80 && (
              <div className="insight positive">
                <strong>High Efficiency:</strong> You solve cases quickly while maintaining quality.
              </div>
            )}
            {hintsUsed === 0 && casesCompleted > 0 && (
              <div className="insight positive">
                <strong>Independent Researcher:</strong> You solve cases without assistance.
              </div>
            )}
            {casesCompleted >= 5 && (
              <div className="insight milestone">
                <strong>Seasoned Investigator:</strong> You've completed multiple historical cases.
              </div>
            )}
            {casesCompleted === 0 && (
              <div className="insight neutral">
                <strong>Beginner Detective:</strong> Start your first case to begin your investigation journey.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;