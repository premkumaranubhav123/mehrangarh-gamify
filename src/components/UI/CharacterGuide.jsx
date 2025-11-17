import React from 'react';
import './CharacterGuide.css';

const CharacterGuide = ({ character = "wizard", message, onClose, position = "bottom-right" }) => {
  const characters = {
    wizard: { emoji: "🧙‍♂️", name: "Story Wizard" },
    detective: { emoji: "🕵️", name: "History Detective" },
    elder: { emoji: "👴", name: "Wisdom Keeper" }
  };

  const currentChar = characters[character] || characters.wizard;

  return (
    <div className={`character-guide ${position}`}>
      <div className="character-avatar">
        <span role="img" aria-label={currentChar.name} className="character-emoji">
          {currentChar.emoji}
        </span>
      </div>
      <div className="character-message">
        <div className="character-name">{currentChar.name}</div>
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="guide-continue-btn">
            Continue Journey
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterGuide;