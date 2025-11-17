import React from 'react';
import './DetectiveCaseFile.css';

const DetectiveCaseFile = ({ 
  caseNumber = 1, 
  title = "Mystery Case", 
  description = "",
  clues = [], 
  status = "investigating",
  progress = 0 
}) => {
  const statusConfig = {
    investigating: { label: "Under Investigation", color: "#FFA500" },
    solved: { label: "Case Solved", color: "#4CAF50" },
    closed: { label: "Case Closed", color: "#607D8B" }
  };

  const currentStatus = statusConfig[status] || statusConfig.investigating;

  return (
    <div className="detective-case-file">
      <div className="case-header">
        <div className="case-number">Case #{caseNumber}</div>
        <div 
          className="case-status" 
          style={{ backgroundColor: currentStatus.color }}
        >
          {currentStatus.label}
        </div>
      </div>
      
      <h3 className="case-title">{title}</h3>
      
      {description && (
        <p className="case-description">{description}</p>
      )}
      
      <div className="progress-section">
        <div className="progress-label">Investigation Progress</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{progress}%</span>
      </div>

      {clues.length > 0 && (
        <div className="clues-section">
          <h4>Evidence Collected:</h4>
          <div className="clues-list">
            {clues.map((clue, index) => (
              <div key={index} className="clue-item">
                <span className="clue-icon">🔍</span>
                <span className="clue-text">{clue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectiveCaseFile;