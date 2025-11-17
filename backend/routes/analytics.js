import express from 'express';
import {
  trackEvent,
  getUserStats,
  getAgeGroupStats,
  getDashboardStats
} from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/events', trackEvent);
router.get('/user-stats/:userId', getUserStats);
router.get('/age-group-stats', getAgeGroupStats);
router.get('/dashboard', getDashboardStats);

export default router;