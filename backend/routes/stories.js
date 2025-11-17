import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read stories data from the frontend data file
const storiesDataPath = join(__dirname, '../../src/data/mehrangarhStories.js');
let mehrangarhStories = [];

try {
  // This is a workaround to import the stories data
  // In production, you might want to move this to a shared data folder
  const storiesModule = await import('../../src/data/mehrangarhStories.js');
  mehrangarhStories = storiesModule.mehrangarhStories || [];
} catch (error) {
  console.warn('⚠️ Could not load stories from frontend, using fallback data');
  // Fallback data
  mehrangarhStories = [
    {
      id: 'fallback-story',
      title: 'Welcome to Mehrangarh',
      description: 'Explore the rich history',
      difficulty: 'beginner',
      paintings: []
    }
  ];
}

// Get all stories
router.get('/', async (req, res) => {
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
});

// Get story by ID
router.get('/:id', async (req, res) => {
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
});

// Get completion stats for user
router.get('/completion/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real app, you'd fetch this from the database
    const stats = {
      totalStories: mehrangarhStories.length,
      completedStories: 0, // This would come from user progress
      completionPercentage: 0,
      favoriteCategory: 'Unknown',
      totalPoints: 0
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
});

export default router;