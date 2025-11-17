import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useBackend } from './useBackend';

const GameContext = createContext();

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    
    case 'SET_AGE_GROUP':
      return {
        ...state,
        ageGroup: action.payload
      };
    
    case 'RESET_AGE':
      return {
        ...state,
        ageGroup: null,
        selectedAge: null
      };
    
    case 'UPDATE_PROGRESS':
      const { storyId, score, stars } = action.payload;
      const completedStories = state.completedStories.includes(storyId) 
        ? state.completedStories 
        : [...state.completedStories, storyId];
      
      const newTotalScore = state.totalScore + score;
      const newLevel = Math.floor(newTotalScore / 1000) + 1;
      
      return {
        ...state,
        totalScore: newTotalScore,
        level: newLevel,
        completedStories,
        stars: state.stars + stars
      };
    
    case 'SYNC_WITH_BACKEND':
      return {
        ...state,
        ...action.payload
      };
    
    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload
      };
    
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  totalScore: 0,
  level: 1,
  completedStories: [],
  stars: 0,
  ageGroup: null,
  achievements: []
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { createUser, saveGameProgress, updateUserProgress, trackEvent } = useBackend();

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      dispatch({ type: 'SYNC_WITH_BACKEND', payload: parsedState });
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  const registerUser = async (userData) => {
    try {
      const user = await createUser(userData);
      dispatch({ type: 'SET_USER', payload: user });
      
      // Track analytics
      await trackEvent({
        type: 'user_registered',
        userId: user._id,
        ageGroup: userData.ageGroup,
        timestamp: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error('Failed to register user:', error);
      // Fallback to local storage
      const localUser = { 
        ...userData, 
        _id: 'local-' + Date.now(),
        gameProgress: {
          totalScore: 0,
          level: 1,
          completedStories: [],
          collectedTreasures: [],
          achievements: []
        }
      };
      dispatch({ type: 'SET_USER', payload: localUser });
      return localUser;
    }
  };

  const completeStory = async (storyData) => {
    const { storyId, score, stars, paintings, timeSpent, answers } = storyData;
    
    // Update local state
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: { storyId, score, stars }
    });

    // Save to backend if user is registered and not local
    if (state.user && state.user._id && !state.user._id.startsWith('local-')) {
      try {
        await saveGameProgress({
          userId: state.user._id,
          storyId,
          paintingId: paintings[0]?.id || 'default',
          score,
          stars,
          timeSpent: timeSpent || 0,
          answers: answers || []
        });

        await updateUserProgress(state.user._id, {
          totalScore: state.totalScore + score,
          completedStories: [...new Set([...state.completedStories, storyId])],
          level: Math.floor((state.totalScore + score) / 1000) + 1
        });

        // Track analytics
        await trackEvent({
          type: 'story_completed',
          userId: state.user._id,
          storyId,
          score,
          stars,
          timeSpent,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Failed to save to backend:', error);
        // Continue with local storage only
      }
    }
  };

  const unlockAchievement = async (achievement) => {
    dispatch({
      type: 'UPDATE_ACHIEVEMENTS',
      payload: [...state.achievements, achievement]
    });

    // Track analytics if user is registered
    if (state.user && state.user._id && !state.user._id.startsWith('local-')) {
      await trackEvent({
        type: 'achievement_unlocked',
        userId: state.user._id,
        achievementId: achievement.id,
        achievementTitle: achievement.title,
        timestamp: new Date().toISOString()
      });
    }
  };

  const value = {
    state,
    dispatch,
    registerUser,
    completeStory,
    unlockAchievement
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};