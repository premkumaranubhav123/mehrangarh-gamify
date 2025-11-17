import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read stories data from the frontend data file
const storiesDataPath = join(__dirname, '../../src/data/mehrangarhStories.js');
let mehrangarhStories = [];

// Try to load stories data
try {
  // This would work if the file is accessible from the backend
  // For now, we'll use fallback data
  mehrangarhStories = getFallbackStories();
  console.log('📚 Loaded fallback stories data');
} catch (error) {
  console.warn('⚠️ Could not load stories from frontend, using fallback data');
  mehrangarhStories = getFallbackStories();
}

// Get all stories
export const getAllStories = async (req, res) => {
  try {
    console.log('✅ Stories data sent to frontend');
    res.json(mehrangarhStories);
  } catch (error) {
    console.error('❌ Get stories error:', error);
    res.status(500).json({ 
      message: 'Error fetching stories', 
      error: error.message 
    });
  }
};

// Get story by ID
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = mehrangarhStories.find(s => s.id === id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    console.log('✅ Story sent:', id);
    res.json(story);
  } catch (error) {
    console.error('❌ Get story error:', error);
    res.status(500).json({ 
      message: 'Error fetching story', 
      error: error.message 
    });
  }
};

// Get completion stats for user
export const getCompletionStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real app, you'd fetch this from the database
    const stats = {
      totalStories: mehrangarhStories.length,
      completedStories: 0, // This would come from user progress
      completionPercentage: 0,
      favoriteCategory: 'Historical',
      totalPoints: 0,
      averageScore: 0,
      storiesByDifficulty: {
        beginner: 0,
        intermediate: 0,
        advanced: 0
      }
    };
    
    console.log('✅ Completion stats sent for user:', userId);
    res.json(stats);
  } catch (error) {
    console.error('❌ Get completion stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching completion stats', 
      error: error.message 
    });
  }
};

// Helper function for fallback stories
function getFallbackStories() {
  return [
    {
      id: 'kannauj-legacy',
      title: 'The Kannauj Legacy',
      description: 'Discover the royal heritage and traditions',
      difficulty: 'beginner',
      category: 'Historical',
      estimatedTime: 15,
      paintings: [
        {
          id: 'p1',
          title: 'Royal Coronation',
          description: 'The grand coronation ceremony of the ruler',
          audio: '/audio/a1.m4a',
          image: '/img/p1.png',
          video: '/video/v1.mp4'
        }
      ]
    },
    {
      id: 'coronation-glory',
      title: 'Coronation Glory',
      description: 'Witness the magnificent coronation rituals',
      difficulty: 'intermediate',
      category: 'Ceremonial',
      estimatedTime: 20,
      paintings: [
        {
          id: 'p2',
          title: 'Throne Room',
          description: 'The majestic throne room during ceremonies',
          audio: '/audio/a2.m4a',
          image: '/img/p2.png',
          video: '/video/v2.mp4'
        }
      ]
    },
    {
      id: 'warrior-kings',
      title: 'Warrior Kings',
      description: 'Explore the military prowess of the rulers',
      difficulty: 'advanced',
      category: 'Military',
      estimatedTime: 25,
      paintings: [
        {
          id: 'p3',
          title: 'Battle Preparation',
          description: 'Warriors preparing for battle',
          audio: '/audio/a3.m4a',
          image: '/img/p3.png',
          video: '/video/v3.mp4'
        }
      ]
    }
  ];
}