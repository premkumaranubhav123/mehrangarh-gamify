import React from 'react';
import { useGame } from '../../hooks/useGameContext';

const ScoreBoard = () => {
  const { state } = useGame();

  return (
    <div className="score-board">
      <div className="score-item">
        <span className="label">Score:</span>
        <span className="value">{state.score}</span>
      </div>
      <div className="score-item">
        <span className="label">Level:</span>
        <span className="value">{state.level}</span>
      </div>
      <div className="score-item">
        <span className="label">Stories:</span>
        <span className="value">{state.completedStories.length}</span>
      </div>
      <div className="score-item">
        <span className="label">Hints Used:</span>
        <span className="value">{state.hintsUsed}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;