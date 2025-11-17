// Helper functions for age-specific content transformation

export const convertToKidLanguage = (text) => {
  const replacements = {
    'historical': 'amazing',
    'ancient': 'magical',
    'royal': 'king and queen\'s',
    'ceremony': 'special party',
    'warrior': 'brave knight',
    'culture': 'fun traditions',
    'heritage': 'family stories',
    'dynasty': 'family of rulers',
    'empire': 'big kingdom',
    'nobility': 'important people'
  };

  let kidText = text;
  Object.entries(replacements).forEach(([adult, kid]) => {
    kidText = kidText.replace(new RegExp(adult, 'gi'), kid);
  });

  return kidText;
};

export const simplifyStoryForSeniors = (story) => {
  // Split into shorter paragraphs for easier reading
  const sentences = story.split('. ').filter(s => s.length > 0);
  const paragraphs = [];
  let currentParagraph = '';

  sentences.forEach(sentence => {
    if ((currentParagraph + sentence).length < 200) {
      currentParagraph += sentence + '. ';
    } else {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = sentence + '. ';
    }
  });

  if (currentParagraph) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs;
};

export const getDifficultyColor = (difficulty, ageGroup) => {
  const colors = {
    kids: {
      beginner: '#4CAF50',
      intermediate: '#FFA500',
      advanced: '#f44336',
      expert: '#9C27B0'
    },
    adults: {
      beginner: '#2196F3',
      intermediate: '#FF9800',
      advanced: '#F44336',
      expert: '#673AB7'
    },
    seniors: {
      beginner: '#4CAF50',
      intermediate: '#FFC107',
      advanced: '#FF9800',
      expert: '#F44336'
    }
  };

  return colors[ageGroup]?.[difficulty] || '#666';
};

export const calculateReadingTime = (text, ageGroup) => {
  const wordsPerMinute = {
    kids: 100,
    adults: 200,
    seniors: 150
  };

  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute[ageGroup]);
  
  return ageGroup === 'kids' 
    ? `About ${minutes} minute${minutes !== 1 ? 's' : ''} to read`
    : `Estimated reading time: ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};