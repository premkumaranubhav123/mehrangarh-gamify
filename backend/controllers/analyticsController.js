// Enhanced analytics with file system storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, '../storage');

// Ensure storage directory exists
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

const analyticsFile = path.join(storagePath, 'analytics.json');

let analyticsEvents = [];

// Load analytics data from file
const loadAnalyticsFromStorage = () => {
  try {
    if (fs.existsSync(analyticsFile)) {
      const data = fs.readFileSync(analyticsFile, 'utf8');
      analyticsEvents = JSON.parse(data);
      console.log('📊 Loaded analytics data from storage');
    }
  } catch (error) {
    console.log('📊 Starting with fresh analytics storage');
    analyticsEvents = [];
  }
};

// Save analytics data to file
const saveAnalyticsToStorage = () => {
  try {
    fs.writeFileSync(analyticsFile, JSON.stringify(analyticsEvents, null, 2));
  } catch (error) {
    console.error('❌ Error saving analytics to storage:', error.message);
  }
};

// Initialize analytics storage
loadAnalyticsFromStorage();

// Track event
export const trackEvent = async (req, res) => {
  try {
    const { type, userId, storyId, score, timestamp, metadata, ageGroup, platform } = req.body;
    
    const event = {
      _id: 'event-' + Date.now(),
      type,
      userId,
      storyId,
      score: score || 0,
      ageGroup: ageGroup || 'adults',
      platform: platform || 'web',
      timestamp: timestamp || new Date().toISOString(),
      metadata: metadata || {},
      sessionId: metadata?.sessionId || 'session-' + Date.now()
    };
    
    analyticsEvents.push(event);
    
    // Keep only last 5000 events in memory
    if (analyticsEvents.length > 5000) {
      analyticsEvents = analyticsEvents.slice(-5000);
    }
    
    saveAnalyticsToStorage();
    
    console.log('📊 Analytics Event:', {
      type,
      userId,
      storyId,
      score,
      ageGroup: event.ageGroup
    });
    
    res.json({ 
      success: true, 
      message: 'Event tracked successfully',
      eventId: event._id,
      timestamp: event.timestamp
    });
  } catch (error) {
    console.error('❌ Analytics event error:', error);
    res.status(500).json({ 
      message: 'Error tracking event', 
      error: error.message 
    });
  }
};

// Get user stats with enhanced insights
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Filter events for this user
    const userEvents = analyticsEvents.filter(event => event.userId === userId);
    const gameEvents = userEvents.filter(event => event.type === 'game_complete');
    const storyEvents = userEvents.filter(event => event.type === 'story_start');
    
    // Calculate enhanced statistics
    const totalPlayTime = userEvents.reduce((sum, event) => sum + (event.metadata.timeSpent || 0), 0);
    const storiesCompleted = new Set(gameEvents.map(event => event.storyId)).size;
    const averageScore = gameEvents.length > 0 
      ? Math.round(gameEvents.reduce((sum, event) => sum + (event.score || 0), 0) / gameEvents.length)
      : 0;
    
    // User engagement metrics
    const firstSession = userEvents.length > 0 ? userEvents[0].timestamp : null;
    const lastSession = userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : null;
    const sessionCount = new Set(userEvents.map(event => event.metadata.sessionId)).size;
    
    // Favorite story (most played)
    const storyCounts = gameEvents.reduce((acc, event) => {
      if (event.storyId) {
        acc[event.storyId] = (acc[event.storyId] || 0) + 1;
      }
      return acc;
    }, {});
    
    const favoriteStory = Object.keys(storyCounts).length > 0 
      ? Object.keys(storyCounts).reduce((a, b) => storyCounts[a] > storyCounts[b] ? a : b)
      : 'None';

    // Progress trends
    const weeklyProgress = calculateWeeklyProgress(userEvents);
    const skillImprovement = calculateSkillImprovement(gameEvents);

    const userStats = {
      userId,
      engagement: {
        totalSessions: sessionCount,
        totalPlayTime: Math.round(totalPlayTime / 60), // minutes
        firstSession,
        lastActive: lastSession,
        averageSessionTime: Math.round(totalPlayTime / (sessionCount * 60)) || 0
      },
      progress: {
        storiesCompleted,
        totalGames: gameEvents.length,
        averageScore,
        favoriteStory,
        completionRate: Math.round((storiesCompleted / (storyEvents.length || 1)) * 100)
      },
      trends: {
        weeklyProgress,
        skillImprovement,
        consistency: calculateConsistency(userEvents)
      },
      preferences: {
        preferredPlatform: getPreferredPlatform(userEvents),
        preferredTime: getPreferredTime(userEvents)
      }
    };
    
    console.log('✅ Enhanced user stats sent for:', userId);
    res.json(userStats);
  } catch (error) {
    console.error('❌ Get user stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching user stats', 
      error: error.message 
    });
  }
};

// Get age group stats with enhanced insights
export const getAgeGroupStats = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    const filteredEvents = filterEventsByPeriod(analyticsEvents, period);
    
    // Enhanced age group statistics
    const ageGroupStats = {
      kids: calculateAgeGroupStats(filteredEvents, 'kids'),
      adults: calculateAgeGroupStats(filteredEvents, 'adults'),
      seniors: calculateAgeGroupStats(filteredEvents, 'seniors'),
      overview: {
        totalUsers: new Set(filteredEvents.map(event => event.userId)).size,
        totalSessions: new Set(filteredEvents.map(event => event.sessionId)).size,
        totalPlayTime: Math.round(filteredEvents.reduce((sum, event) => sum + (event.metadata.timeSpent || 0), 0) / 3600),
        period,
        lastUpdated: new Date().toISOString()
      }
    };
    
    // Engagement trends
    ageGroupStats.engagementTrends = calculateEngagementTrends(filteredEvents);
    ageGroupStats.popularContent = getPopularContent(filteredEvents);
    
    console.log('✅ Enhanced age group stats sent for period:', period);
    res.json(ageGroupStats);
  } catch (error) {
    console.error('❌ Get age group stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching age group stats', 
      error: error.message 
    });
  }
};

// Get real-time dashboard data
export const getDashboardStats = async (req, res) => {
  try {
    const last24Hours = analyticsEvents.filter(event => {
      const eventTime = new Date(event.timestamp);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return eventTime > yesterday;
    });
    
    const dashboardStats = {
      realTime: {
        activeUsers: new Set(last24Hours.map(event => event.userId)).size,
        sessionsToday: new Set(last24Hours.map(event => event.sessionId)).size,
        gamesCompleted: last24Hours.filter(event => event.type === 'game_complete').length,
        newRegistrations: last24Hours.filter(event => event.type === 'user_registered').length
      },
      performance: {
        averageSessionTime: calculateAverageSessionTime(last24Hours),
        completionRate: calculateCompletionRate(last24Hours),
        popularStories: getPopularContent(last24Hours, 3)
      },
      userAcquisition: {
        byAgeGroup: getAcquisitionByAgeGroup(last24Hours),
        byPlatform: getAcquisitionByPlatform(last24Hours)
      }
    };
    
    res.json({
      success: true,
      data: dashboardStats,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching dashboard stats', 
      error: error.message 
    });
  }
};

// Helper functions
const filterEventsByPeriod = (events, period) => {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'day':
      startDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return events; // all time
  }
  
  return events.filter(event => new Date(event.timestamp) > startDate);
};

const calculateAgeGroupStats = (events, ageGroup) => {
  const groupEvents = events.filter(event => event.ageGroup === ageGroup);
  const gameEvents = groupEvents.filter(event => event.type === 'game_complete');
  const uniqueUsers = new Set(groupEvents.map(event => event.userId)).size;
  
  return {
    totalUsers: uniqueUsers,
    totalGames: gameEvents.length,
    averageScore: gameEvents.length > 0 
      ? Math.round(gameEvents.reduce((sum, event) => sum + (event.score || 0), 0) / gameEvents.length)
      : 0,
    favoriteStory: getMostPopularStory(groupEvents),
    engagementScore: calculateEngagementScore(groupEvents),
    completionRate: Math.round((new Set(gameEvents.map(event => event.storyId)).size / 10) * 100) // assuming 10 total stories
  };
};

const calculateEngagementScore = (events) => {
  if (events.length === 0) return 0;
  
  const sessionCount = new Set(events.map(event => event.sessionId)).size;
  const totalTime = events.reduce((sum, event) => sum + (event.metadata.timeSpent || 0), 0);
  const gameCount = events.filter(event => event.type === 'game_complete').length;
  
  return Math.min(100, Math.round(
    (sessionCount * 0.4) + 
    (Math.log(totalTime + 1) * 0.3) + 
    (gameCount * 0.3)
  ));
};

const calculateWeeklyProgress = (events) => {
  // Simplified weekly progress calculation
  const weeklyData = {};
  events.forEach(event => {
    const week = getWeekNumber(new Date(event.timestamp));
    if (!weeklyData[week]) {
      weeklyData[week] = { games: 0, score: 0, time: 0 };
    }
    if (event.type === 'game_complete') {
      weeklyData[week].games++;
      weeklyData[week].score += event.score || 0;
    }
    weeklyData[week].time += event.metadata.timeSpent || 0;
  });
  
  return weeklyData;
};

const calculateSkillImprovement = (gameEvents) => {
  if (gameEvents.length < 2) return 0;
  
  const firstHalf = gameEvents.slice(0, Math.floor(gameEvents.length / 2));
  const secondHalf = gameEvents.slice(Math.floor(gameEvents.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, event) => sum + (event.score || 0), 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, event) => sum + (event.score || 0), 0) / secondHalf.length;
  
  return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
};

const calculateConsistency = (events) => {
  if (events.length === 0) return 0;
  
  const sessions = [...new Set(events.map(event => event.sessionId))];
  const sessionDates = sessions.map(session => {
    const sessionEvents = events.filter(event => event.sessionId === session);
    return new Date(sessionEvents[0].timestamp).toDateString();
  });
  
  const uniqueDays = new Set(sessionDates).size;
  const totalDays = Math.ceil((new Date() - new Date(events[0].timestamp)) / (1000 * 60 * 60 * 24));
  
  return Math.round((uniqueDays / Math.max(totalDays, 1)) * 100);
};

const getPreferredPlatform = (events) => {
  const platforms = events.reduce((acc, event) => {
    acc[event.platform] = (acc[event.platform] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(platforms).length > 0 
    ? Object.keys(platforms).reduce((a, b) => platforms[a] > platforms[b] ? a : b)
    : 'web';
};

const getPreferredTime = (events) => {
  const hours = events.reduce((acc, event) => {
    const hour = new Date(event.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(hours).length > 0 
    ? Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b)
    : '12';
};

const getMostPopularStory = (events) => {
  const storyCounts = events.reduce((acc, event) => {
    if (event.storyId) {
      acc[event.storyId] = (acc[event.storyId] || 0) + 1;
    }
    return acc;
  }, {});
  
  return Object.keys(storyCounts).length > 0 
    ? Object.keys(storyCounts).reduce((a, b) => storyCounts[a] > storyCounts[b] ? a : b)
    : 'None';
};

const calculateEngagementTrends = (events) => {
  // Simplified engagement trends
  const dailyEngagement = {};
  events.forEach(event => {
    const date = new Date(event.timestamp).toDateString();
    if (!dailyEngagement[date]) {
      dailyEngagement[date] = 0;
    }
    dailyEngagement[date]++;
  });
  
  return dailyEngagement;
};

const getPopularContent = (events, limit = 5) => {
  const storyCounts = events.reduce((acc, event) => {
    if (event.storyId) {
      acc[event.storyId] = (acc[event.storyId] || 0) + 1;
    }
    return acc;
  }, {});
  
  return Object.entries(storyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([storyId, count]) => ({ storyId, plays: count }));
};

const calculateAverageSessionTime = (events) => {
  const sessionTimes = {};
  events.forEach(event => {
    if (!sessionTimes[event.sessionId]) {
      sessionTimes[event.sessionId] = 0;
    }
    sessionTimes[event.sessionId] += event.metadata.timeSpent || 0;
  });
  
  const times = Object.values(sessionTimes);
  return times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
};

const calculateCompletionRate = (events) => {
  const startEvents = events.filter(event => event.type === 'story_start').length;
  const completeEvents = events.filter(event => event.type === 'game_complete').length;
  
  return startEvents > 0 ? Math.round((completeEvents / startEvents) * 100) : 0;
};

const getAcquisitionByAgeGroup = (events) => {
  const ageGroups = events.reduce((acc, event) => {
    acc[event.ageGroup] = (acc[event.ageGroup] || 0) + 1;
    return acc;
  }, {});
  
  return ageGroups;
};

const getAcquisitionByPlatform = (events) => {
  const platforms = events.reduce((acc, event) => {
    acc[event.platform] = (acc[event.platform] || 0) + 1;
    return acc;
  }, {});
  
  return platforms;
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};