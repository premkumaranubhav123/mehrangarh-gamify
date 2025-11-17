import express from 'express';
import {
  createUser,
  getUser,
  updateUserProgress,
  getLeaderboard,
  getAllUsers,
  trackStoryCompletion
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id/progress', updateUserProgress);
router.get('/leaderboard/:ageGroup', getLeaderboard);

// Story completion tracking
router.post('/:id/story-completion', trackStoryCompletion);

export default router;