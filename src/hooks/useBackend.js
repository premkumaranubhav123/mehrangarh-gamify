import { useState, useEffect } from 'react';
import { userAPI, gameAPI, analyticsAPI, api } from '../services/api';

export const useBackend = () => {
  const [isOnline, setIsOnline] = useState(null); // Start with null to indicate initial loading
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'offline'

  // Check backend connectivity
  const checkBackendConnection = async () => {
    try {
      await api.get('/health');
      setIsOnline(true);
      setBackendStatus('connected');
      return true;
    } catch (error) {
      console.log('🌐 Backend offline, using local storage');
      setIsOnline(false);
      setBackendStatus('offline');
      return false;
    }
  };

  useEffect(() => {
    checkBackendConnection();
    
    const interval = setInterval(checkBackendConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // User management
  const createUser = async (userData) => {
    try {
      const response = await userAPI.create(userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const getUser = async (userId) => {
    try {
      const response = await userAPI.get(userId);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  // Game progress management
  const saveGameProgress = async (progressData) => {
    try {
      const response = await gameAPI.saveProgress(progressData);
      return response.data.data;
    } catch (error) {
      console.error('Error saving game progress:', error);
      throw error;
    }
  };

  const getUserProgress = async (userId) => {
    try {
      const response = await gameAPI.getProgress(userId);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  };

  const getLeaderboard = async (type = 'score', limit = 10) => {
    try {
      const response = await userAPI.getLeaderboard(type);
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return []; // Return empty array instead of throwing
    }
  };

  const updateUserProgress = async (userId, progressData) => {
    try {
      const response = await userAPI.updateProgress(userId, progressData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  };

  // Analytics
  const trackEvent = async (eventData) => {
    try {
      await analyticsAPI.trackEvent(eventData);
    } catch (error) {
      console.error('Error tracking event:', error);
      // Silently fail for analytics
    }
  };

  return {
    isOnline,
    backendStatus, // Export backendStatus
    checkBackendConnection,
    createUser,
    getUser,
    saveGameProgress,
    getUserProgress,
    getLeaderboard,
    updateUserProgress,
    trackEvent
  };
};