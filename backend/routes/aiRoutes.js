import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getGuestsForAI,
  getPredictions,
  streamPredictions,
  trackEngagement,
  trackEngagementEvent,
  trackSentiment,
  getEngagementStats,
  getSentimentAnalytics,
  getNetworkingOpportunities,
  getGuestPairings,
  updateGuestEmotionalState,
  guestMatching,
  getNetworkingRecommendations,
  getActivitySuggestions,
  recordInteraction,
  getInteractions,
  getInteractionStats,
  getSmartPairings,
  getEmotionalIntelligence,
  getGuestEmotionalProfile
} from '../controllers/aiController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Main AI endpoints for the 5 features
router.get('/guests-data/:eventId', getGuestsForAI);
router.get('/predictions/:eventId', getPredictions);
router.get('/predictions-stream/:eventId', streamPredictions);

// Real-time engagement tracking
router.post('/track-engagement', trackEngagement);
router.post('/track-event', trackEngagementEvent);
router.get('/engagement-stats/:eventId', getEngagementStats);

// Interaction event tracking (NEW)
router.post('/interactions/:eventId', recordInteraction);
router.get('/interactions/:eventId', getInteractions);
router.get('/interactions/:eventId/stats', getInteractionStats);
router.get('/smart-pairings/:eventId', getSmartPairings);

// Sentiment tracking & analytics
router.post('/track-sentiment', trackSentiment);
router.get('/sentiment-analytics/:eventId', getSentimentAnalytics);

// Specific feature endpoints
router.get('/networking-opportunities/:eventId', getNetworkingOpportunities);
router.get('/guest-pairings/:eventId', getGuestPairings);

// Guest emotional state and intelligence
router.get('/emotional-intelligence/:eventId', getEmotionalIntelligence);
router.get('/emotional-intelligence/:eventId/:guestId', getGuestEmotionalProfile);
router.put('/guest-emotional-state/:guestId', updateGuestEmotionalState);

// Legacy/backup endpoints for backward compatibility
router.post('/guest-matching', guestMatching);
router.post('/networking', getNetworkingRecommendations);
router.post('/activities', getActivitySuggestions);

export default router;

