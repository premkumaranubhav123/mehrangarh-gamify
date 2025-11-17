import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import { mehrangarhStories } from '../../data/mehrangarhStories';
import EvidenceBoard from './EvidenceBoard';
import PerformanceMetrics from './PerformanceMetrics';

const AdultsGameEngine = ({ onComplete, onResetAge }) => {
  const { state, dispatch } = useGame();
  const [currentStory, setCurrentStory] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameState, setGameState] = useState('selecting');
  const [achievements, setAchievements] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedClues, setRevealedClues] = useState([]);
  const [showFullStory, setShowFullStory] = useState(false);
  const [analyzedEvidence, setAnalyzedEvidence] = useState([]);
  const [investigationStartTime, setInvestigationStartTime] = useState(null);
  const [casePerformance, setCasePerformance] = useState({
    questionsCorrect: 0,
    questionsTotal: 0,
    evidenceAnalyzed: 0,
    totalEvidence: 0
  });

  // Enhanced detective ranks system
  const detectiveRanks = [
    { name: 'Novice', score: 0, cases: 0 },
    { name: 'Investigator', score: 1000, cases: 2 },
    { name: 'Detective', score: 2500, cases: 5 },
    { name: 'Senior Detective', score: 5000, cases: 8 },
    { name: 'Chief Inspector', score: 10000, cases: 12 },
    { name: 'Historical Scholar', score: 20000, cases: 15 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentRank = () => {
    const sortedRanks = [...detectiveRanks].sort((a, b) => b.score - a.score);
    return sortedRanks.find(rank => state.score >= rank.score && state.completedStories.length >= rank.cases) || detectiveRanks[0];
  };

  const getSkillBreakdown = () => {
    const totalQuestions = casePerformance.questionsTotal || 1;
    const accuracy = (casePerformance.questionsCorrect / totalQuestions) * 100;
    const researchSkills = Math.min(100, (analyzedEvidence.length / (currentStory?.paintings?.length || 1)) * 100);
    const efficiency = Math.max(0, 100 - (timeSpent / 60));
    
    return {
      'Historical Accuracy': Math.round(accuracy),
      'Research Skills': Math.round(researchSkills),
      'Investigation Efficiency': Math.round(efficiency),
      'Case Completion': Math.round((state.completedStories.length / mehrangarhStories.length) * 100)
    };
  };

  const startStory = (story) => {
    setCurrentStory(story);
    setGameState('investigating');
    setCurrentPuzzle(0);
    setHintsUsed(0);
    setRevealedClues([]);
    setTimeSpent(0);
    setShowFullStory(false);
    setAnalyzedEvidence([]);
    setInvestigationStartTime(Date.now());
    
    const totalEvidence = story.paintings?.reduce((total, painting) => 
      total + (painting.questions?.length || 0), 0) || 0;
    
    setCasePerformance({
      questionsCorrect: 0,
      questionsTotal: 0,
      evidenceAnalyzed: 0,
      totalEvidence: totalEvidence
    });
  };

  const handleEvidenceAnalyzed = (evidence) => {
    setAnalyzedEvidence(prev => [...prev, evidence]);
    setCasePerformance(prev => ({
      ...prev,
      evidenceAnalyzed: prev.evidenceAnalyzed + 1
    }));
    dispatch({ type: 'ADD_SCORE', payload: evidence.points || 50 });
  };

  const solveMystery = (questionIndex, selectedOption, isCorrect) => {
    if (!currentStory?.paintings?.[currentPuzzle]?.questions?.[questionIndex]) {
      console.error('Invalid question index:', questionIndex);
      return;
    }

    const question = currentStory.paintings[currentPuzzle].questions[questionIndex];
    
    setCasePerformance(prev => ({
      ...prev,
      questionsTotal: prev.questionsTotal + 1,
      questionsCorrect: prev.questionsCorrect + (isCorrect ? 1 : 0)
    }));

    if (isCorrect) {
      const basePoints = question.points || 100;
      const timeBonus = Math.max(0, 300 - timeSpent) * 0.5;
      const evidenceBonus = analyzedEvidence.length * 10;
      const totalPoints = basePoints + timeBonus + evidenceBonus;

      dispatch({ type: 'ADD_SCORE', payload: totalPoints });
      
      // Check for complex achievements
      if (question.points >= 200) {
        addAchievement('Expert Analyst', 'Solved a complex historical puzzle', '🔍');
      }
      
      if (casePerformance.questionsCorrect + 1 === casePerformance.questionsTotal) {
        addAchievement('Perfect Analysis', 'Answered all questions correctly in a case', '💯');
      }
      
      // Move to next puzzle or complete investigation
      if (currentPuzzle < (currentStory.paintings?.length || 1) - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setRevealedClues([]);
        setShowFullStory(false);
      } else {
        completeInvestigation();
      }
    } else {
      dispatch({ type: 'ADD_SCORE', payload: -20 });
    }
  };

  const completeInvestigation = () => {
    const investigationDuration = investigationStartTime ? Date.now() - investigationStartTime : 0;
    const timeScore = Math.max(0, 1000 - Math.floor(investigationDuration / 1000));
    const evidenceScore = analyzedEvidence.length * 50;
    const accuracyScore = casePerformance.questionsTotal > 0 ? 
      (casePerformance.questionsCorrect / casePerformance.questionsTotal) * 200 : 0;
    
    const totalReward = (currentStory?.completionReward || 500) + timeScore + evidenceScore + accuracyScore;

    if (currentStory?.id) {
      dispatch({ 
        type: 'COMPLETE_STORY', 
        payload: { 
          storyId: currentStory.id,
          paintings: currentStory.paintings || [] 
        } 
      });
    }
    
    dispatch({ type: 'ADD_SCORE', payload: totalReward });
    
    if (timeSpent < 300) {
      addAchievement('Quick Thinker', 'Completed investigation in under 5 minutes', '⚡');
    }
    
    if (hintsUsed === 0) {
      addAchievement('Independent Researcher', 'Solved case without using hints', '🎯');
    }

    if (analyzedEvidence.length === casePerformance.totalEvidence) {
      addAchievement('Thorough Investigator', 'Analyzed all available evidence', '🔎');
    }

    if (casePerformance.questionsCorrect === casePerformance.questionsTotal && casePerformance.questionsTotal > 0) {
      addAchievement('Flawless Deduction', 'Perfect score on all questions', '💎');
    }

    const currentRank = getCurrentRank();
    addAchievement(`${currentRank.name}`, `Reached ${currentRank.name} rank`, '⭐');

    setGameState('caseClosed');
  };

  const addAchievement = (title, description, icon = '🏆') => {
    const achievement = { 
      id: Date.now().toString(),
      title, 
      description, 
      timestamp: new Date().toLocaleTimeString(),
      icon,
      unlockedAt: new Date().toLocaleDateString()
    };
    setAchievements(prev => [...prev, achievement]);
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const useHint = (clueIndex) => {
    if (!revealedClues.includes(clueIndex)) {
      setHintsUsed(prev => prev + 1);
      setRevealedClues(prev => [...prev, clueIndex]);
      dispatch({ type: 'USE_HINT' });
    }
  };

  const continueToNextCase = () => {
    setCurrentStory(null);
    setGameState('selecting');
    setAchievements([]);
  };

  const showPerformanceMetrics = () => {
    setGameState('performanceReview');
  };

  // Enhanced evidence data for the EvidenceBoard
  const getCaseEvidence = () => {
    if (!currentStory?.paintings) return [];
    
    return currentStory.paintings.flatMap((painting, index) => {
      const evidenceItems = [];
      
      // Add painting as evidence
      if (painting) {
        evidenceItems.push({
          id: `painting-${index}`,
          title: painting.title || 'Untitled Painting',
          description: `Historical artwork from ${currentStory.title || 'Unknown Story'}`,
          detailedDescription: painting.story ? painting.story.split('\n\n')[0] : 'No description available',
          icon: '🖼️',
          clues: painting.clues || [],
          category: 'Artwork'
        });
      }
      if (painting.questions) {
        painting.questions.forEach((question, qIndex) => {
          evidenceItems.push({
            id: `question-${index}-${qIndex}`,
            title: `Analysis Point: ${question.question ? question.question.substring(0, 50) + '...' : 'Unknown Question'}`,
            description: 'Critical thinking challenge',
            detailedDescription: question.question || 'No question text',
            icon: '❓',
            clues: question.options || [],
            category: 'Analysis'
          });
        });
      }
      
      return evidenceItems;
    });
  };

  const getCaseTitle = (storyId) => {
    const cases = {
      'kannauj-legacy': 'The Kannauj Exodus Mystery',
      'coronation-glory': 'Coronation Ceremony Analysis',
      'warrior-kings': 'Military Strategy Assessment',
      'music-art': 'Ragamala Artistic Interpretation',
      'court-life': 'Zenana Court Dynamics',
      'royal-sports': 'Royal Polo Tradition Study',
      'royal-patronage': 'Cultural Patronage Evaluation',
      'divine-power': 'Religious Iconography Analysis',
      'royal-hunts': 'Hunting Expedition Documentation',
      'court-culture': 'Bardic Tradition Examination'
    };
    return cases[storyId] || 'Historical Investigation';
  };

  const getCaseDescription = (storyId) => {
    const descriptions = {
      'kannauj-legacy': 'Analyze the Rathore migration and its historical significance',
      'coronation-glory': 'Study royal coronation rituals and their symbolism',
      'warrior-kings': 'Examine military strategies and cultural exchanges',
      'music-art': 'Interpret the connection between visual art and musical traditions',
      'court-life': 'Investigate the political dynamics within the zenana',
      'royal-sports': 'Document the social aspects of royal sporting traditions',
      'royal-patronage': 'Evaluate the impact of royal support on arts and culture',
      'divine-power': 'Analyze religious symbolism and its political implications',
      'royal-hunts': 'Study hunting as military training and royal entertainment',
      'court-culture': 'Examine the role of bards in preserving historical records'
    };
    return descriptions[storyId] || 'Historical analysis required';
  };

  if (gameState === 'selecting') {
    const currentRank = getCurrentRank();
    
    return (
      <div className="adults-selection">
        <div className="detective-header">
          <button className="age-reset-btn" onClick={onResetAge}>🔄 Change Mode</button>
          <h1>🕵️ Art Detective Academy</h1>
          <div className="detective-stats">
            <div className="stat">🎯 Score: {state.score}</div>
            <div className="stat">🏆 Cases: {state.completedStories.length}</div>
            <div className="stat">⭐ Rank: {currentRank.name}</div>
            <div className="stat">📊 Level: {state.level}</div>
          </div>
        </div>

        <PerformanceMetrics
          casesCompleted={state.completedStories.length}
          totalScore={state.score}
          averageAccuracy={casePerformance.questionsTotal > 0 ? 
            Math.round((casePerformance.questionsCorrect / casePerformance.questionsTotal) * 100) : 0}
          investigationTime={timeSpent}
          hintsUsed={hintsUsed}
          achievements={state.achievements || []}
          rank={currentRank.name}
          skillBreakdown={getSkillBreakdown()}
        />

        <div className="case-files">
          <h2>📁 Active Case Files</h2>
          <p className="subtitle">Solve historical mysteries and uncover artistic secrets through detailed investigation</p>
          
          <div className="cases-grid">
            {mehrangarhStories.map((story, index) => (
              <motion.div
                key={story.id}
                className={`case-file ${story.difficulty} ${state.completedStories.includes(story.id) ? 'solved' : 'unsolved'}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => startStory(story)}
              >
                <div className="case-header">
                  <span className="case-icon">📋</span>
                  <div className="case-info">
                    <h3>{getCaseTitle(story.id)}</h3>
                    <span className="case-difficulty">{story.difficulty.toUpperCase()}</span>
                  </div>
                </div>
                <p className="case-description">{getCaseDescription(story.id)}</p>
                <div className="case-details">
                  <span className="clues">{story.paintings?.length || 0} Evidence Pieces</span>
                  <span className="questions">
                    {story.paintings?.reduce((total, p) => total + (p.questions?.length || 0), 0) || 0} Analysis Points
                  </span>
                  <span className="reward">+{story.completionReward || 500} pts</span>
                </div>
                <div className="case-metrics">
                  <div className="metric">⏱️ Est. {Math.max(5, (story.paintings?.length || 1) * 3)}min</div>
                  <div className="metric">
                    🔍 {story.paintings?.reduce((total, p) => total + (p.clues?.length || 0), 0) || 0} clues
                  </div>
                </div>
                {state.completedStories.includes(story.id) && (
                  <div className="solved-badge">CASE SOLVED</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="achievements-panel">
            <h3>🏆 Recent Achievements</h3>
            <div className="achievements-list">
              {achievements.slice(-3).map((achievement, index) => (
                <div key={achievement.id} className="achievement-item">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-details">
                    <span className="achievement-title">{achievement.title}</span>
                    <span className="achievement-desc">{achievement.description}</span>
                    <span className="achievement-time">{achievement.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'investigating' && currentStory) {
    const currentPainting = currentStory.paintings?.[currentPuzzle];
    
    if (!currentPainting) {
      return (
        <div className="error-state">
          <h2>Investigation Error</h2>
          <p>No painting data available for investigation.</p>
          <button onClick={() => setGameState('selecting')}>Return to Case Files</button>
        </div>
      );
    }

    const storyPreview = currentPainting.story ? currentPainting.story.split('\n\n')[0] : 'No story available';
    const shouldTruncate = storyPreview.length > 200 && !showFullStory;
    const displayStory = shouldTruncate 
      ? `${storyPreview.substring(0, 200)}...` 
      : (showFullStory ? currentPainting.story : storyPreview);

    return (
      <div className="investigation-room">
        <div className="investigation-header">
          <button className="back-btn" onClick={() => setGameState('selecting')}>← Case Files</button>
          <h2>🔍 Investigating: {getCaseTitle(currentStory.id)}</h2>
          <div className="investigation-stats">
            <span>Evidence {currentPuzzle + 1}/{currentStory.paintings?.length || 1}</span>
            <span>Hints: {hintsUsed}</span>
            <span>Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
            <span>Score: {state.score}</span>
          </div>
        </div>

        <div className="investigation-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${((currentPuzzle + 1) / (currentStory.paintings?.length || 1)) * 100}%` 
              }}
            ></div>
          </div>
          <div className="progress-text">
            Case Progress: {currentPuzzle + 1} of {currentStory.paintings?.length || 1} pieces analyzed
          </div>
        </div>

        <EvidenceBoard
          evidence={getCaseEvidence()}
          onEvidenceAnalyzed={handleEvidenceAnalyzed}
          currentCase={getCaseTitle(currentStory.id)}
        />

        <div className="evidence-board">
          <div className="primary-evidence">
            <motion.img
              src={currentPainting.imageUrl}
              alt={currentPainting.title}
              className="evidence-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onError={(e) => {
                e.target.style.display = 'none';
                console.error('Failed to load image:', currentPainting.imageUrl);
              }}
            />
          </div>
          
          <div className="evidence-details">
            <div className="historical-context">
              <div className="story-header">
                <h4>📜 Historical Context</h4>
                <button 
                  className="story-toggle"
                  onClick={() => setShowFullStory(!showFullStory)}
                >
                  {showFullStory ? 'Show Less' : 'Show Full Story'}
                </button>
              </div>
              <div className="story-content">
                {displayStory.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {currentPainting.clues && currentPainting.clues.length > 0 && (
              <div className="clue-analysis">
                <h4>🔎 Key Clues</h4>
                <div className="clues-list">
                  {currentPainting.clues.map((clue, index) => (
                    <div key={index} className="clue-item">
                      {revealedClues.includes(index) ? (
                        <div className="revealed-clue">
                          ✅ {clue}
                        </div>
                      ) : (
                        <button 
                          className="clue-reveal"
                          onClick={() => useHint(index)}
                        >
                          Reveal Clue {index + 1} (-50 pts)
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPainting.questions && currentPainting.questions.length > 0 && (
              <div className="investigation-questions">
                <h4>❓ Analysis Questions</h4>
                {currentPainting.questions.map((question, qIndex) => (
                  <div key={qIndex} className="analysis-question">
                    <h5>{question.question}</h5>
                    <div className="analysis-options">
                      {question.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          className="analysis-option"
                          onClick={() => solveMystery(
                            qIndex, 
                            optIndex, 
                            optIndex === question.correct
                          )}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'caseClosed') {
    const currentRank = getCurrentRank();
    const accuracy = casePerformance.questionsTotal > 0 ? 
      Math.round((casePerformance.questionsCorrect / casePerformance.questionsTotal) * 100) : 0;
    
    return (
      <div className="case-closed">
        <div className="closure-report">
          <h2>✅ CASE CLOSED</h2>
          <div className="closure-details">
            <h3>{getCaseTitle(currentStory?.id)}</h3>
            <div className="performance-metrics">
              <div className="metric">
                <span className="label">Final Score</span>
                <span className="value">+{currentStory?.completionReward || 500}</span>
              </div>
              <div className="metric">
                <span className="label">Time Taken</span>
                <span className="value">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
              </div>
              <div className="metric">
                <span className="label">Accuracy</span>
                <span className="value">{accuracy}%</span>
              </div>
              <div className="metric">
                <span className="label">Evidence Analyzed</span>
                <span className="value">{analyzedEvidence.length}/{casePerformance.totalEvidence}</span>
              </div>
              <div className="metric">
                <span className="label">Current Rank</span>
                <span className="value">{currentRank.name}</span>
              </div>
            </div>
            
            {achievements.length > 0 && (
              <div className="new-achievements">
                <h4>New Achievements Unlocked:</h4>
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className="achievement-badge">
                    {achievement.icon} {achievement.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="closure-actions">
            <button 
              onClick={showPerformanceMetrics} 
              className="metrics-btn"
            >
              📊 View Detailed Metrics
            </button>
            
            <button 
              onClick={continueToNextCase} 
              className="next-case-btn"
            >
              🔍 Take Another Case
            </button>
            
            <button 
              onClick={onComplete} 
              className="gallery-btn"
            >
              🏛️ Visit Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'performanceReview') {
    const accuracy = casePerformance.questionsTotal > 0 ? 
      Math.round((casePerformance.questionsCorrect / casePerformance.questionsTotal) * 100) : 0;

    return (
      <div className="performance-review">
        <div className="review-header">
          <button className="back-btn" onClick={() => setGameState('caseClosed')}>← Back</button>
          <h2>📊 Case Performance Review</h2>
          <button onClick={continueToNextCase} className="next-case-btn">
            Next Case
          </button>
        </div>

        <PerformanceMetrics
          casesCompleted={state.completedStories.length}
          totalScore={state.score}
          averageAccuracy={accuracy}
          investigationTime={timeSpent}
          hintsUsed={hintsUsed}
          achievements={state.achievements || []}
          rank={getCurrentRank().name}
          skillBreakdown={getSkillBreakdown()}
        />

        <div className="detailed-breakdown">
          <h3>Case Breakdown</h3>
          <div className="breakdown-grid">
            <div className="breakdown-card">
              <h4>Evidence Analysis</h4>
              <div className="breakdown-value">
                {analyzedEvidence.length}/{casePerformance.totalEvidence}
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill" 
                  style={{ 
                    width: `${casePerformance.totalEvidence > 0 ? 
                      (analyzedEvidence.length / casePerformance.totalEvidence) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="breakdown-card">
              <h4>Question Accuracy</h4>
              <div className="breakdown-value">{accuracy}%</div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill" 
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>
            <div className="breakdown-card">
              <h4>Time Efficiency</h4>
              <div className="breakdown-value">
                {Math.max(0, 100 - Math.floor(timeSpent / 6))}%
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill" 
                  style={{ 
                    width: `${Math.max(0, 100 - Math.floor(timeSpent / 6))}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="loading">Loading investigation...</div>;
};

export default AdultsGameEngine;