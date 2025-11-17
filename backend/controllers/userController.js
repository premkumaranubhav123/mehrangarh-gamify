// Enhanced in-memory storage for users with file persistence
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

const usersFile = path.join(storagePath, 'users.json');

let usersStorage = [];
let userCounter = 1;

// Load users from file
const loadUsersFromStorage = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      usersStorage = JSON.parse(data);
      // Find the highest user ID
      const maxId = usersStorage.reduce((max, user) => {
        const idNum = parseInt(user._id?.replace('user-', '') || '0');
        return Math.max(max, idNum);
      }, 0);
      userCounter = maxId + 1;
      console.log('👤 Loaded users from storage:', usersStorage.length);
    }
  } catch (error) {
    console.log('👤 Starting with fresh users storage');
    usersStorage = [];
    userCounter = 1;
  }
};

// Save users to file
const saveUsersToStorage = () => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(usersStorage, null, 2));
  } catch (error) {
    console.error('❌ Error saving users to storage:', error.message);
  }
};

// Initialize users storage
loadUsersFromStorage();

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, email, ageGroup, preferences } = req.body;

    // Check if user already exists
    const existingUser = usersStorage.find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    const user = {
      _id: 'user-' + userCounter++,
      username,
      email,
      ageGroup,
      preferences: preferences || {
        fontSize: 'medium',
        audioEnabled: true,
        highContrast: false,
        language: 'english'
      },
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
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    usersStorage.push(user);
    saveUsersToStorage();
    
    console.log('✅ New user created (persistent storage):', username);
    console.log('📊 Total users:', usersStorage.length);
    
    res.status(201).json(user);
  } catch (error) {
    console.error('❌ User creation error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

// Get user by ID
export const getUser = async (req, res) => {
  try {
    const user = usersStorage.find(u => u._id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

// Update user progress
export const updateUserProgress = async (req, res) => {
  try {
    const { totalScore, level, completedStories, collectedTreasures, achievements, playerStats } = req.body;
    
    const userIndex = usersStorage.findIndex(u => u._id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user progress
    usersStorage[userIndex].gameProgress = {
      totalScore: totalScore !== undefined ? totalScore : usersStorage[userIndex].gameProgress.totalScore,
      level: level || usersStorage[userIndex].gameProgress.level,
      completedStories: completedStories || usersStorage[userIndex].gameProgress.completedStories,
      collectedTreasures: collectedTreasures || usersStorage[userIndex].gameProgress.collectedTreasures,
      achievements: achievements || usersStorage[userIndex].gameProgress.achievements,
      playerStats: playerStats || usersStorage[userIndex].gameProgress.playerStats
    };

    usersStorage[userIndex].lastActive = new Date().toISOString();
    saveUsersToStorage();

    console.log('✅ User progress updated:', usersStorage[userIndex].username, 'Score:', totalScore);
    res.json(usersStorage[userIndex]);
  } catch (error) {
    console.error('❌ Update progress error:', error);
    res.status(500).json({ 
      message: 'Error updating progress', 
      error: error.message 
    });
  }
};

// Get leaderboard by age group
export const getLeaderboard = async (req, res) => {
  try {
    const { ageGroup } = req.params;
    
    let leaderboard = usersStorage
      .filter(user => !ageGroup || user.ageGroup === ageGroup)
      .sort((a, b) => b.gameProgress.totalScore - a.gameProgress.totalScore)
      .slice(0, 10)
      .map(user => ({
        _id: user._id,
        username: user.username,
        ageGroup: user.ageGroup,
        gameProgress: user.gameProgress,
        lastActive: user.lastActive,
        createdAt: user.createdAt
      }));

    // If no users found, provide mock data
    if (leaderboard.length === 0) {
      leaderboard = Array.from({ length: 5 }, (_, i) => ({
        _id: `mock-user-${i}`,
        username: `Explorer${i + 1}`,
        ageGroup: ageGroup || 'adults',
        gameProgress: {
          totalScore: 1000 - (i * 150),
          level: Math.floor((1000 - (i * 150)) / 100) + 1,
          completedStories: ['kannauj-legacy', 'coronation-glory'].slice(0, Math.floor(Math.random() * 3)),
          playerStats: {
            gamesPlayed: Math.floor(Math.random() * 10) + 1,
            averageScore: Math.floor(Math.random() * 200) + 400,
            bestScore: Math.floor(Math.random() * 300) + 700,
            playTime: Math.floor(Math.random() * 1800) + 600
          }
        },
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }));
    }
    
    console.log('✅ Leaderboard fetched for:', ageGroup || 'all groups', 'Users:', leaderboard.length);
    res.json(leaderboard);
  } catch (error) {
    console.error('❌ Leaderboard error:', error);
    res.status(500).json({ 
      message: 'Error fetching leaderboard', 
      error: error.message 
    });
  }
};

// Get all users (for debugging)
export const getAllUsers = async (req, res) => {
  try {
    console.log('✅ Users list sent. Total users:', usersStorage.length);
    res.json(usersStorage);
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

// Track story completion
export const trackStoryCompletion = async (req, res) => {
  try {
    const { userId, storyId, score, stars, ageGroup, timeSpent } = req.body;

    const storyCompletion = {
      _id: 'completion-' + Date.now(),
      user: userId,
      storyId,
      score,
      stars,
      ageGroup,
      timeSpent: timeSpent || 0,
      completedAt: new Date().toISOString()
    };

    console.log('✅ Story completion tracked:', storyId, 'for user:', userId, 'Score:', score);
    res.status(201).json(storyCompletion);
  } catch (error) {
    console.error('❌ Story completion tracking error:', error);
    res.status(500).json({
      message: 'Error tracking story completion',
      error: error.message
    });
  }
};