// src/utils/soundEffects.js
export const playSound = (type) => {
  // In a real app, you would play actual sound files
  const sounds = {
    success: () => console.log('🔊 Playing success sound'),
    error: () => console.log('🔊 Playing error sound'),
    click: () => console.log('🔊 Playing click sound'),
    victory: () => console.log('🔊 Playing victory sound'),
    clueFound: () => console.log('🔊 Playing clue found sound'),
    levelUp: () => console.log('🔊 Playing level up sound')
  };
  
  if (sounds[type]) {
    sounds[type]();
  }
};

export const preloadSounds = () => {
  // Preload sound files for better performance
  console.log('🔊 Preloading game sounds...');
};