// Enhanced in-memory storage for Node.js
let gameProgressStorage = [];
let achievementsStorage = [];

// File system storage for persistence (Node.js compatible)
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

const storageFile = {
  gameProgress: path.join(storagePath, 'gameProgress.json'),
  achievements: path.join(storagePath, 'achievements.json')
};

// Load data from file system
const loadFromStorage = () => {
  try {
    if (fs.existsSync(storageFile.gameProgress)) {
      const data = fs.readFileSync(storageFile.gameProgress, 'utf8');
      gameProgressStorage = JSON.parse(data);
    }
    if (fs.existsSync(storageFile.achievements)) {
      const data = fs.readFileSync(storageFile.achievements, 'utf8');
      achievementsStorage = JSON.parse(data);
    }
    console.log('📦 Loaded data from file storage');
  } catch (error) {
    console.log('📦 Starting with fresh storage');
    gameProgressStorage = [];
    achievementsStorage = [];
  }
};

// Save to file system
const saveToStorage = () => {
  try {
    fs.writeFileSync(storageFile.gameProgress, JSON.stringify(gameProgressStorage, null, 2));
    fs.writeFileSync(storageFile.achievements, JSON.stringify(achievementsStorage, null, 2));
  } catch (error) {
    console.error('❌ Error saving to storage:', error.message);
  }
};

// Initialize storage
loadFromStorage();

// Enhanced achievement definitions
const ACHIEVEMENT_DEFINITIONS = [
  {
    achievementId: 'first_story',
    title: 'First Discovery',
    description: 'Complete your first story',
    icon: '🔍',
    category: 'completion',
    points: 100,
    condition: (progress) => progress.completedStories >= 1
  },
  {
    achievementId: 'score_1000',
    title: 'Master Detective',
    description: 'Reach 1000 total points',
    icon: '🏆',
    category: 'skill',
    points: 200,
    condition: (progress) => progress.totalScore >= 1000
  },
  {
    achievementId: 'star_collector',
    title: 'Star Collector',
    description: 'Collect 50 stars',
    icon: '⭐',
    category: 'collection',
    points: 150,
    condition: (progress) => progress.totalStars >= 50
  },
  {
    achievementId: 'story_master',
    title: 'Story Master',
    description: 'Complete 5 different stories',
    icon: '📚',
    category: 'completion',
    points: 300,
    condition: (progress) => progress.completedStories >= 5
  },
  {
    achievementId: 'speed_racer',
    title: 'Speed Racer',
    description: 'Complete a story in under 5 minutes',
    icon: '⚡',
    category: 'skill',
    points: 250,
    condition: (progress) => progress.bestTime && progress.bestTime <= 300
  },
  {
    achievementId: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 5 stars on 3 different stories',
    icon: '✨',
    category: 'skill',
    points: 400,
    condition: (progress) => progress.fiveStarStories >= 3
  }
];

// Save game progress
export const saveGameProgress = async (req, res) => {
  try {
    const { userId, storyId, paintingId, score, stars, timeSpent, answers, ageGroup } = req.body;

    // Validate required fields
    if (!userId || !storyId || !paintingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, storyId, paintingId'
      });
    }

    const gameProgress = {
      _id: 'mem-' + Date.now(),
      userId,
      storyId,
      paintingId,
      score: score || 0,
      stars: stars || 0,
      timeSpent: timeSpent || 0,
      answers: answers || [],
      ageGroup: ageGroup || 'adults',
      completedAt: new Date().toISOString()
    };
    
    gameProgressStorage.push(gameProgress);
    
    // Keep only last 1000 records in memory
    if (gameProgressStorage.length > 1000) {
      gameProgressStorage = gameProgressStorage.slice(-1000);
    }

    saveToStorage();

    // Update user's total progress and check achievements
    const achievements = await updateUserProgressAndCheckAchievements(userId, storyId, score, stars, timeSpent);

    res.status(201).json({
      success: true,
      message: 'Game progress saved successfully',
      data: {
        progress: gameProgress,
        unlockedAchievements: achievements
      }
    });

  } catch (error) {
    console.error('❌ Error saving game progress:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user game progress
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProgress = gameProgressStorage.filter(progress => progress.userId === userId);

    // Calculate enhanced statistics
    const totalScore = userProgress.reduce((sum, progress) => sum + (progress.score || 0), 0);
    const totalStars = userProgress.reduce((sum, progress) => sum + (progress.stars || 0), 0);
    const completedStories = [...new Set(userProgress.map(progress => progress.storyId))];
    const totalPlayTime = userProgress.reduce((sum, progress) => sum + (progress.timeSpent || 0), 0);
    
    // Calculate average score per story
    const averageScore = userProgress.length > 0 ? Math.round(totalScore / userProgress.length) : 0;
    
    // Find favorite story (most played)
    const storyCounts = userProgress.reduce((acc, progress) => {
      acc[progress.storyId] = (acc[progress.storyId] || 0) + 1;
      return acc;
    }, {});
    
    const favoriteStory = Object.keys(storyCounts).length > 0 
      ? Object.keys(storyCounts).reduce((a, b) => storyCounts[a] > storyCounts[b] ? a : b)
      : 'None';

    res.json({
      success: true,
      data: {
        progress: userProgress,
        summary: {
          totalScore,
          totalStars,
          completedStories: completedStories.length,
          totalGames: userProgress.length,
          totalPlayTime,
          averageScore,
          favoriteStory,
          playerLevel: calculatePlayerLevel(totalScore)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { type = 'score', limit = 10, ageGroup } = req.query;

    console.log('💾 Using enhanced in-memory storage for leaderboard');
    
    const userProgressMap = new Map();
    
    gameProgressStorage.forEach(progress => {
      // Filter by ageGroup if specified
      if (ageGroup && progress.ageGroup !== ageGroup) return;
      
      if (!userProgressMap.has(progress.userId)) {
        userProgressMap.set(progress.userId, {
          userId: progress.userId,
          username: `User${progress.userId.slice(-4)}`, // Generate readable username
          totalScore: 0,
          totalStars: 0,
          totalGames: 0,
          averageScore: 0,
          playerLevel: 1,
          lastPlayed: progress.completedAt,
          ageGroup: progress.ageGroup || 'adults'
        });
      }
      
      const userData = userProgressMap.get(progress.userId);
      userData.totalScore += progress.score || 0;
      userData.totalStars += progress.stars || 0;
      userData.totalGames += 1;
      userData.averageScore = Math.round(userData.totalScore / userData.totalGames);
      userData.playerLevel = calculatePlayerLevel(userData.totalScore);
      
      if (new Date(progress.completedAt) > new Date(userData.lastPlayed)) {
        userData.lastPlayed = progress.completedAt;
      }
    });
    
    const leaderboard = Array.from(userProgressMap.values())
      .sort((a, b) => {
        if (type === 'stars') return b.totalStars - a.totalStars;
        if (type === 'games') return b.totalGames - a.totalGames;
        if (type === 'level') return b.playerLevel - a.playerLevel;
        return b.totalScore - a.totalScore; // Default: score
      })
      .slice(0, parseInt(limit))
      .map((user, index) => ({
        rank: index + 1,
        ...user
      }));

    res.json({
      success: true,
      data: {
        leaderboard,
        type,
        ageGroup: ageGroup || 'all',
        totalPlayers: userProgressMap.size,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user achievements
export const getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userAchievements = achievementsStorage.filter(achievement => achievement.userId === userId);
    
    // Calculate achievement progress
    const userProgress = gameProgressStorage.filter(progress => progress.userId === userId);
    const progressData = calculateUserProgress(userProgress);
    
    const allAchievements = ACHIEVEMENT_DEFINITIONS.map(achievementDef => {
      const unlocked = userAchievements.find(a => a.achievementId === achievementDef.achievementId);
      const progress = achievementDef.condition(progressData) ? 100 : 0;
      
      return {
        ...achievementDef,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        progress,
        currentProgress: progressData
      };
    });

    res.json({
      success: true,
      data: {
        achievements: allAchievements,
        summary: {
          total: allAchievements.length,
          unlocked: allAchievements.filter(a => a.isUnlocked).length,
          totalPoints: allAchievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Unlock achievement manually (for testing)
export const unlockAchievement = async (req, res) => {
  try {
    const { userId, achievementId } = req.body;
    
    const achievementDef = ACHIEVEMENT_DEFINITIONS.find(a => a.achievementId === achievementId);
    if (!achievementDef) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    const existing = achievementsStorage.find(
      a => a.userId === userId && a.achievementId === achievementId
    );
    
    if (!existing) {
      const achievement = {
        _id: 'mem-' + Date.now(),
        userId,
        ...achievementDef,
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      };
      
      achievementsStorage.push(achievement);
      saveToStorage();
      
      res.json({
        success: true,
        message: 'Achievement unlocked!',
        data: achievement
      });
    } else {
      res.json({
        success: true,
        message: 'Achievement already unlocked',
        data: existing
      });
    }

  } catch (error) {
    console.error('❌ Error unlocking achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get game statistics
export const getGameStats = async (req, res) => {
  try {
    const totalGames = gameProgressStorage.length;
    const totalPlayers = new Set(gameProgressStorage.map(p => p.userId)).size;
    const averageScore = gameProgressStorage.reduce((sum, p) => sum + (p.score || 0), 0) / totalGames || 0;
    
    // Age group distribution
    const ageGroups = gameProgressStorage.reduce((acc, progress) => {
      const group = progress.ageGroup || 'adults';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});
    
    // Most popular stories
    const storyCounts = gameProgressStorage.reduce((acc, progress) => {
      acc[progress.storyId] = (acc[progress.storyId] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalGames,
        totalPlayers,
        averageScore: Math.round(averageScore),
        ageGroupDistribution: ageGroups,
        popularStories: Object.entries(storyCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([storyId, count]) => ({ storyId, plays: count })),
        totalPlayTime: Math.round(gameProgressStorage.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 3600), // hours
        achievementsUnlocked: achievementsStorage.length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching game stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Helper functions
const calculateUserProgress = (userProgress) => {
  const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
  const totalStars = userProgress.reduce((sum, p) => sum + (p.stars || 0), 0);
  const completedStories = new Set(userProgress.map(p => p.storyId)).size;
  const fiveStarStories = userProgress.filter(p => p.stars === 5).length;
  const bestTime = Math.min(...userProgress.map(p => p.timeSpent || Infinity));
  
  return {
    totalScore,
    totalStars,
    completedStories,
    fiveStarStories,
    bestTime: bestTime === Infinity ? null : bestTime
  };
};

const calculatePlayerLevel = (totalScore) => {
  return Math.floor(totalScore / 100) + 1;
};

const updateUserProgressAndCheckAchievements = async (userId, storyId, score, stars, timeSpent) => {
  try {
    const userProgress = gameProgressStorage.filter(progress => progress.userId === userId);
    const progressData = calculateUserProgress(userProgress);
    
    const unlockedAchievements = [];
    
    // Check each achievement
    for (const achievementDef of ACHIEVEMENT_DEFINITIONS) {
      const existing = achievementsStorage.find(
        a => a.userId === userId && a.achievementId === achievementDef.achievementId
      );
      
      if (!existing && achievementDef.condition(progressData)) {
        const achievement = {
          _id: 'mem-' + Date.now(),
          userId,
          ...achievementDef,
          isUnlocked: true,
          unlockedAt: new Date().toISOString()
        };
        
        achievementsStorage.push(achievement);
        unlockedAchievements.push(achievement);
        console.log('🏆 Achievement unlocked:', achievementDef.title, 'for user:', userId);
      }
    }
    
    if (unlockedAchievements.length > 0) {
      saveToStorage();
    }
    
    return unlockedAchievements;

  } catch (error) {
    console.error('❌ Error checking achievements:', error);
    return [];
  }
};