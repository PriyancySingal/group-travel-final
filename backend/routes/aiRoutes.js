import express from 'express';
import {
  guestMatching,
  getNetworkingRecommendations,
  getActivitySuggestions
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected AI endpoints
router.use(protect);

router.post('/guest-matching', guestMatching);
router.post('/networking', getNetworkingRecommendations);
router.post('/activities', getActivitySuggestions);

export default router;
