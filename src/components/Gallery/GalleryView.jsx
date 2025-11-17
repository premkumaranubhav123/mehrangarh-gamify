import React from 'react';
import { useGame } from '../../hooks/useGameContext';
import StoryGallery from './StoryGallery';

const GalleryView = ({ onRestart }) => {
  const { state } = useGame();

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <h2>Your Mehrangarh Journey</h2>
        <div className="journey-stats">
          <div className="stat">
            <span className="label">Total Score:</span>
            <span className="value">{state.score}</span>
          </div>
          <div className="stat">
            <span className="label">Stories Completed:</span>
            <span className="value">{state.completedStories.length}</span>
          </div>
          <div className="stat">
            <span className="label">Paintings Discovered:</span>
            <span className="value">{state.discoveredPaintings.length}</span>
          </div>
        </div>
      </div>

      {/* Discovered Paintings Section */}
      {state.discoveredPaintings.length > 0 && (
        <section className="discovered-section">
          <h3>Your Discovered Masterpieces</h3>
          <div className="discovered-paintings">
            {state.discoveredPaintings.map((painting, index) => (
              <div key={index} className="painting-thumbnail">
                <img src={painting.imageUrl} alt={painting.title} />
                <h4>{painting.title}</h4>
                <span className="completion-badge">✓ Discovered</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Complete Story Gallery */}
      <section className="full-gallery">
        <StoryGallery />
      </section>

      <div className="gallery-actions">
        <button onClick={onRestart} className="restart-button">
          Start New Journey
        </button>
        <button onClick={() => window.print()} className="print-button">
          Print Your Collection
        </button>
      </div>
    </div>
  );
};

export default GalleryView;