import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EvidenceBoard = ({ evidence, onEvidenceAnalyzed, currentCase }) => {
  const [analyzedEvidence, setAnalyzedEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [analysisNotes, setAnalysisNotes] = useState('');

  const handleEvidenceClick = (evidenceItem) => {
    setSelectedEvidence(evidenceItem);
    setAnalysisNotes('');
  };

  const analyzeEvidence = () => {
    if (selectedEvidence && analysisNotes.trim()) {
      const newAnalyzedEvidence = {
        ...selectedEvidence,
        analysis: analysisNotes,
        analyzedAt: new Date().toLocaleTimeString(),
        points: calculateAnalysisPoints(analysisNotes)
      };
      
      setAnalyzedEvidence(prev => [...prev, newAnalyzedEvidence]);
      onEvidenceAnalyzed(newAnalyzedEvidence);
      setSelectedEvidence(null);
      setAnalysisNotes('');
    }
  };

  const calculateAnalysisPoints = (analysis) => {
    const basePoints = 50;
    const lengthBonus = Math.min(analysis.length * 0.5, 100);
    const keywordBonus = containsHistoricalKeywords(analysis) ? 75 : 0;
    return basePoints + lengthBonus + keywordBonus;
  };

  const containsHistoricalKeywords = (text) => {
    const keywords = ['historical', 'context', 'significance', 'cultural', 'traditional', 'symbolism', 'heritage'];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  return (
    <div className="evidence-board">
      <div className="evidence-header">
        <h3>🔍 Evidence Analysis Board</h3>
        <div className="evidence-stats">
          <span>Analyzed: {analyzedEvidence.length}/{evidence.length}</span>
          <span>Case: {currentCase}</span>
        </div>
      </div>

      <div className="evidence-content">
        <div className="evidence-gallery">
          <h4>Available Evidence</h4>
          <div className="evidence-items">
            {evidence.map((item, index) => (
              <motion.div
                key={item.id || index}
                className={`evidence-item ${analyzedEvidence.find(e => e.id === item.id) ? 'analyzed' : 'pending'} ${selectedEvidence?.id === item.id ? 'selected' : ''}`}
                onClick={() => handleEvidenceClick(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="evidence-icon">{item.icon || '📄'}</div>
                <div className="evidence-info">
                  <h5>{item.title || 'Untitled Evidence'}</h5>
                  <p>{item.description || 'No description available'}</p>
                  {analyzedEvidence.find(e => e.id === item.id) && (
                    <span className="analysis-badge">✓ Analyzed</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="analysis-panel">
          {selectedEvidence ? (
            <div className="analysis-interface">
              <h4>Analyzing: {selectedEvidence.title}</h4>
              <div className="evidence-detail">
                <p>{selectedEvidence.detailedDescription || 'No detailed description available.'}</p>
                {selectedEvidence.clues && selectedEvidence.clues.length > 0 && (
                  <div className="evidence-clues">
                    <h5>Potential Clues:</h5>
                    <ul>
                      {selectedEvidence.clues.map((clue, idx) => (
                        <li key={idx}>{clue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="analysis-input">
                <label>Your Analysis:</label>
                <textarea
                  value={analysisNotes}
                  onChange={(e) => setAnalysisNotes(e.target.value)}
                  placeholder="Record your observations, historical context, and conclusions..."
                  rows="6"
                />
                <div className="analysis-tips">
                  <strong>Analysis Tips:</strong>
                  <ul>
                    <li>Consider historical context</li>
                    <li>Look for symbolic meanings</li>
                    <li>Connect to broader historical themes</li>
                    <li>Note any cultural significance</li>
                  </ul>
                </div>
                <button 
                  onClick={analyzeEvidence}
                  disabled={!analysisNotes.trim()}
                  className="analyze-btn"
                >
                  Submit Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="analysis-placeholder">
              <h4>Select Evidence to Analyze</h4>
              <p>Click on any evidence item from the gallery to begin your analysis.</p>
              <div className="analysis-guidelines">
                <h5>Investigation Guidelines:</h5>
                <ul>
                  <li>Examine each piece of evidence carefully</li>
                  <li>Consider the historical period and context</li>
                  <li>Look for connections between different evidence</li>
                  <li>Document your reasoning thoroughly</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="analysis-log">
          <h4>Analysis Log</h4>
          {analyzedEvidence.length > 0 ? (
            <div className="log-entries">
              {analyzedEvidence.map((entry, index) => (
                <div key={entry.id || index} className="log-entry">
                  <div className="log-header">
                    <span className="evidence-title">{entry.title}</span>
                    <span className="log-time">{entry.analyzedAt}</span>
                    <span className="log-points">+{entry.points} pts</span>
                  </div>
                  <p className="log-analysis">{entry.analysis}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-entries">No evidence analyzed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceBoard;