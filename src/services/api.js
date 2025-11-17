import axios from 'axios';

// Make sure this points to port 5001
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Increased timeout for better UX
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;
    
    console.error(`❌ ${status} ${url}:`, error.message);
    
    // Enhanced error handling
    if (status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('unauthorized'));
    } else if (status === 503) {
      // Handle service unavailable
      console.log('🔶 Service temporarily unavailable, using fallback');
    }
    
    return Promise.reject(error);
  }
);

// Enhanced mock data with persistence
const getMockUser = () => {
  const mockUser = localStorage.getItem('mockUser');
  return mockUser ? JSON.parse(mockUser) : null;
};

const saveMockUser = (user) => {
  localStorage.setItem('mockUser', JSON.stringify(user));
};

const mockUserAPI = {
  create: async (userData) => {
    console.log('📝 Using enhanced mock user API - creating user');
    const user = {
      _id: 'user-' + Date.now(),
      ...userData,
      gameProgress: {
        totalScore: 0,
        level: 1,
        completedStories: [],
        collectedTreasures: [],
        achievements: [],
        playerStats: {
          gamesPlayed: 0,
          averageScore: 0,
          bestScore: 0,
          playTime: 0
        }
      },
      preferences: userData.preferences || {
        fontSize: 'medium',
        audioEnabled: true,
        highContrast: false,
        language: 'english'
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    saveMockUser(user);
    return { data: { success: true, data: user } };
  },
  
  get: async (userId) => {
    console.log('📝 Using enhanced mock user API - getting user');
    const user = getMockUser();
    return { data: { success: true, data: user } };
  },
  
  updateProgress: async (userId, progressData) => {
    console.log('📝 Using enhanced mock user API - updating progress');
    const user = getMockUser();
    if (user) {
      user.gameProgress = { ...user.gameProgress, ...progressData };
      user.lastActive = new Date().toISOString();
      saveMockUser(user);
    }
    return { data: { success: true, data: user } };
  },
  
  getLeaderboard: async (ageGroup) => {
    console.log('📝 Using enhanced mock user API - leaderboard');
    const mockLeaderboard = Array.from({ length: 15 }, (_, i) => ({
      _id: `user-${i}`,
      username: `Explorer${i + 1}`,
      ageGroup: ageGroup || ['kids', 'adults', 'seniors'][i % 3],
      gameProgress: {
        totalScore: 2000 - (i * 120),
        level: Math.floor((2000 - (i * 120)) / 100) + 1,
        completedStories: ['kannauj-legacy', 'coronation-glory', 'warrior-kings'].slice(0, Math.floor(Math.random() * 4) + 1),
        playerStats: {
          gamesPlayed: Math.floor(Math.random() * 20) + 5,
          averageScore: Math.floor(Math.random() * 300) + 500,
          bestScore: Math.floor(Math.random() * 500) + 800,
          playTime: Math.floor(Math.random() * 3600) + 1800
        }
      },
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })).sort((a, b) => b.gameProgress.totalScore - a.gameProgress.totalScore);
    
    return { data: { success: true, data: mockLeaderboard } };
  }
};

// Enhanced API functions with better fallback handling
export const userAPI = {
  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      console.log('✅ Backend user created');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using enhanced mock data');
      return await mockUserAPI.create(userData);
    }
  },
  
  get: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      return await mockUserAPI.get(userId);
    }
  },
  
  updateProgress: async (userId, progressData) => {
    try {
      const response = await api.put(`/users/${userId}/progress`, progressData);
      console.log('✅ User progress updated in backend');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using enhanced mock data');
      return await mockUserAPI.updateProgress(userId, progressData);
    }
  },
  
  getLeaderboard: async (ageGroup) => {
    try {
      const response = await api.get(`/users/leaderboard/${ageGroup}`);
      console.log('✅ Leaderboard fetched from backend');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using enhanced mock data');
      return await mockUserAPI.getLeaderboard(ageGroup);
    }
  },
};

// Enhanced Game APIs
export const gameAPI = {
  saveProgress: async (progressData) => {
    try {
      const response = await api.post('/games/progress', progressData);
      console.log('✅ Game progress saved to backend');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, progress saved locally');
      // Enhanced local storage with metadata
      const key = `gameProgress-${progressData.userId}-${Date.now()}`;
      const enhancedProgress = {
        ...progressData,
        savedLocally: true,
        localSaveId: key,
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      localStorage.setItem(key, JSON.stringify(enhancedProgress));
      
      // Also update user's overall progress
      const userKey = `userProgress-${progressData.userId}`;
      const userProgress = JSON.parse(localStorage.getItem(userKey) || '{"games": [], "stats": {}}');
      userProgress.games.push(enhancedProgress);
      userProgress.stats = calculateUserStats(userProgress.games);
      localStorage.setItem(userKey, JSON.stringify(userProgress));
      
      return { data: { success: true, data: { savedLocally: true, localSaveId: key } } };
    }
  },
  
  getProgress: async (userId) => {
    try {
      const response = await api.get(`/games/progress/${userId}`);
      return response;
    } catch (error) {
      // Get from enhanced local storage
      const userKey = `userProgress-${userId}`;
      const localData = localStorage.getItem(userKey);
      return { 
        data: { 
          success: true, 
          data: localData ? JSON.parse(localData) : { games: [], stats: {} } 
        } 
      };
    }
  },
  
  getAchievements: async (userId) => {
    try {
      const response = await api.get(`/games/achievements/${userId}`);
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using mock achievements');
      // Mock achievements data
      const mockAchievements = [
        {
          achievementId: 'first_story',
          title: 'First Discovery',
          description: 'Complete your first story',
          icon: '🔍',
          category: 'completion',
          points: 100,
          isUnlocked: true,
          progress: 100
        },
        // ... more mock achievements
      ];
      return { data: { success: true, data: { achievements: mockAchievements } } };
    }
  },
  
  getLeaderboard: async (type = 'score', limit = 10, ageGroup = null) => {
    try {
      const response = await api.get('/games/leaderboard', {
        params: { type, limit, ageGroup }
      });
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using mock leaderboard');
      return await mockUserAPI.getLeaderboard(ageGroup);
    }
  },
  
  getStats: async () => {
    try {
      const response = await api.get('/games/stats');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using mock stats');
      return { 
        data: { 
          success: true, 
          data: {
            totalGames: 0,
            totalPlayers: 0,
            averageScore: 0,
            ageGroupDistribution: {},
            popularStories: []
          }
        } 
      };
    }
  }
};

// Enhanced Story APIs
export const storyAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/stories');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using local stories');
      // You might want to import local stories data here
      return { data: { success: true, data: [] } };
    }
  },
  
  getById: async (storyId) => {
    try {
      const response = await api.get(`/stories/${storyId}`);
      return response;
    } catch (error) {
      return { data: { success: true, data: null } };
    }
  },
  
  getCompletionStats: async (userId) => {
    try {
      const response = await api.get(`/stories/completion/${userId}`);
      return response;
    } catch (error) {
      return { data: { success: true, data: {} } };
    }
  },
};

// Enhanced Analytics APIs
export const analyticsAPI = {
  trackEvent: async (eventData) => {
    try {
      const response = await api.post('/analytics/events', eventData);
      console.log('📊 Analytics event tracked:', eventData.type);
      return response;
    } catch (error) {
      console.log('🔶 Analytics event saved locally');
      // Enhanced local analytics storage
      const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
      const enhancedEvent = {
        ...eventData,
        savedLocally: true,
        localId: 'local-' + Date.now(),
        timestamp: new Date().toISOString()
      };
      events.push(enhancedEvent);
      localStorage.setItem('analyticsEvents', JSON.stringify(events.slice(-1000))); // Keep last 1000
      return { data: { success: true, data: { savedLocally: true, localId: enhancedEvent.localId } } };
    }
  },
  
  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/analytics/user-stats/${userId}`);
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using mock user stats');
      return { 
        data: { 
          success: true, 
          data: {
            userId,
            engagement: {
              totalSessions: 1,
              totalPlayTime: 0,
              firstSession: new Date().toISOString(),
              lastActive: new Date().toISOString()
            },
            progress: {
              storiesCompleted: 0,
              totalGames: 0,
              averageScore: 0,
              favoriteStory: 'None'
            }
          }
        } 
      };
    }
  },
  
  getAgeGroupStats: async () => {
    try {
      const response = await api.get('/analytics/age-group-stats');
      return response;
    } catch (error) {
      return { data: { success: true, data: {} } };
    }
  },
  
  getDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response;
    } catch (error) {
      console.log('🔶 Backend unavailable, using mock dashboard stats');
      return {
        data: {
          success: true,
          data: {
            realTime: {
              activeUsers: 0,
              sessionsToday: 0,
              gamesCompleted: 0,
              newRegistrations: 0
            },
            performance: {
              averageSessionTime: 0,
              completionRate: 0,
              popularStories: []
            }
          }
        }
      };
    }
  }
};

// Helper function to calculate user stats from local games
const calculateUserStats = (games) => {
  if (games.length === 0) {
    return {
      totalScore: 0,
      totalGames: 0,
      averageScore: 0,
      bestScore: 0,
      totalPlayTime: 0,
      completedStories: 0,
      favoriteStory: 'None'
    };
  }
  
  const totalScore = games.reduce((sum, game) => sum + (game.score || 0), 0);
  const bestScore = Math.max(...games.map(game => game.score || 0));
  const totalPlayTime = games.reduce((sum, game) => sum + (game.timeSpent || 0), 0);
  const completedStories = new Set(games.map(game => game.storyId)).size;
  
  // Find favorite story
  const storyCounts = games.reduce((acc, game) => {
    acc[game.storyId] = (acc[game.storyId] || 0) + 1;
    return acc;
  }, {});
  
  const favoriteStory = Object.keys(storyCounts).length > 0 
    ? Object.keys(storyCounts).reduce((a, b) => storyCounts[a] > storyCounts[b] ? a : b)
    : 'None';
  
  return {
    totalScore,
    totalGames: games.length,
    averageScore: Math.round(totalScore / games.length),
    bestScore,
    totalPlayTime,
    completedStories,
    favoriteStory
  };
};

// Export the axios instance as default
export { api };
export default api;