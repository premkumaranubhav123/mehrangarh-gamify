import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { additionalStories, getFunFacts, startQuiz, shareStory } from '../../data/mehrangarhStories';

const StoryGallery = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(additionalStories.map(story => story.category))];

  const filteredStories = filter === 'all' 
    ? additionalStories 
    : additionalStories.filter(story => story.category === filter);

  const openStory = (story) => {
    setSelectedStory(story);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  return (
    <div className="story-gallery">
      <h2>Explore Mehrangarh's Artistic Treasures</h2>
      
      {/* Filter Buttons */}
      <div className="gallery-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openStory(story)}
          >
            <div className="image-container">
              <img src={story.imageUrl} alt={story.title} />
              <div className="overlay">
                <h3>{story.title}</h3>
                <span className="category">{story.category}</span>
                <span className="era">{story.era}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="story-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStory}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closeStory}>×</button>
              
              <div className="modal-header">
                <h2>{selectedStory.title}</h2>
                <div className="meta-info">
                  <span className="category">{selectedStory.category}</span>
                  <span className="era">{selectedStory.era}</span>
                </div>
              </div>

              <div className="modal-body">
                <div className="story-image">
                  <img src={selectedStory.imageUrl} alt={selectedStory.title} />
                </div>
                <div className="story-content">
                  <div className="story-text">
                    {selectedStory.story.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {/* Interactive Elements */}
                  <div className="interactive-elements">
                    <h4>Did You Know?</h4>
                    <div className="fun-facts">
                      {getFunFacts(selectedStory.id).map((fact, index) => (
                        <div key={index} className="fun-fact">
                          💡 {fact}
                        </div>
                      ))}
                    </div>
                    
                    <div className="action-buttons">
                      <button className="quiz-btn" onClick={() => startQuiz(selectedStory)}>
                        Take Quiz About This Story
                      </button>
                      <button className="share-btn" onClick={() => shareStory(selectedStory)}>
                        Share This Story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryGallery;