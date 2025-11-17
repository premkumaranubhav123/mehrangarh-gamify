import express from 'express';
import {
  saveGameProgress,
  getUserProgress,
  getLeaderboard,
  getGameStats,
  getUserAchievements,
  unlockAchievement
} from '../controllers/gameController.js';

const router = express.Router();

router.post('/progress', saveGameProgress);
router.get('/progress/:userId', getUserProgress);
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getGameStats);
router.get('/achievements/:userId', getUserAchievements);
router.post('/achievements/unlock', unlockAchievement);

export default router;