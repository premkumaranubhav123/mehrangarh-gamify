import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGameContext';
import KidsGameEngine from './KidsGameEngine';
import AdultsGameEngine from './AdultsGameEngine';
import SeniorsGameEngine from './SeniorsGameEngine';
import AgeSelection from '../UI/AgeSelection';
import UserRegistration from '../UI/UserRegistration';

const AgeSpecificGameEngine = ({ onComplete }) => {
  const { state, dispatch } = useGame();
  const [currentView, setCurrentView] = useState('age-selection');
  const [selectedAge, setSelectedAge] = useState(null);

  useEffect(() => {
    console.log('🔍 AgeSpecificGameEngine - Current view:', currentView, 'Age:', selectedAge, 'User:', state.user);
  }, [currentView, selectedAge, state.user]);

  const handleAgeSelect = (ageGroup) => {
    console.log('🎯 Age selected:', ageGroup);
    setSelectedAge(ageGroup);
    
    // If user doesn't exist, show registration
    if (!state.user) {
      setCurrentView('registration');
    } else {
      // If user exists, go directly to game
      dispatch({ type: 'SET_AGE_GROUP', payload: ageGroup });
      setCurrentView('game');
    }
  };

  const handleRegistrationComplete = () => {
    console.log('✅ Registration completed');
    
    // Set age group and proceed to game
    dispatch({ type: 'SET_AGE_GROUP', payload: selectedAge });
    setCurrentView('game');
  };

  const handleResetAge = () => {
    console.log('🔄 Resetting age selection');
    setSelectedAge(null);
    setCurrentView('age-selection');
  };

  const handleGameComplete = () => {
    console.log('🎉 Game completed');
    onComplete();
  };

  // Show age selection first
  if (currentView === 'age-selection') {
    return <AgeSelection onAgeSelect={handleAgeSelect} />;
  }

  // Show registration after age selection
  if (currentView === 'registration') {
    return (
      <UserRegistration 
        onComplete={handleRegistrationComplete}
        preSelectedAge={selectedAge}
        onBack={handleResetAge}
      />
    );
  }

  // Show game engine
  if (currentView === 'game' && state.ageGroup) {
    console.log('🎮 Rendering game for:', state.ageGroup);
    
    const gameEngines = {
      kids: <KidsGameEngine onComplete={handleGameComplete} onResetAge={handleResetAge} />,
      adults: <AdultsGameEngine onComplete={handleGameComplete} onResetAge={handleResetAge} />,
      seniors: <SeniorsGameEngine onComplete={handleGameComplete} onResetAge={handleResetAge} />
    };

    return gameEngines[state.ageGroup];
  }

  // Fallback - go back to age selection
  return <AgeSelection onAgeSelect={handleAgeSelect} />;
};

export default AgeSpecificGameEngine;