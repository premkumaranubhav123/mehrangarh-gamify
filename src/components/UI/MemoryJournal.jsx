import React, { useState } from 'react';

const MemoryJournal = ({ story, onSaveEntry }) => {
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);

  const handleSaveEntry = () => {
    if (entry.trim()) {
      const newEntry = {
        id: Date.now(),
        text: entry,
        timestamp: new Date().toLocaleString(),
        storyTitle: story?.title || 'General Reflection'
      };
      
      setSavedEntries(prev => [newEntry, ...prev]);
      if (onSaveEntry) onSaveEntry(newEntry);
      setEntry('');
      
      // Show success message
      alert('📖 Memory saved to your journal!');
    }
  };

  const promptQuestions = [
    "What did this story remind you of?",
    "How does this connect to your own experiences?",
    "What surprised you about this historical account?",
    "What emotions did this story evoke?",
    "What would you like to remember from this story?"
  ];

  const getRandomPrompt = () => {
    return promptQuestions[Math.floor(Math.random() * promptQuestions.length)];
  };

  return (
    <div className="memory-journal">
      <h3>📖 Personal Memory Journal</h3>
      
      <div className="journal-prompt">
        <strong>Writing Prompt:</strong> {getRandomPrompt()}
      </div>

      <div className="journal-entry">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Share your thoughts, memories, or reflections about this story..."
          className="journal-textarea"
          rows="5"
        />
        <button 
          onClick={handleSaveEntry}
          disabled={!entry.trim()}
          className="save-entry-btn"
        >
          💾 Save to Journal
        </button>
      </div>

      {savedEntries.length > 0 && (
        <div className="journal-entries">
          <h4>Your Saved Memories:</h4>
          <div className="entries-list">
            {savedEntries.slice(0, 3).map(entry => (
              <div key={entry.id} className="journal-entry-item">
                <div className="entry-header">
                  <strong>{entry.storyTitle}</strong>
                  <span className="entry-time">{entry.timestamp}</span>
                </div>
                <p className="entry-text">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryJournal;