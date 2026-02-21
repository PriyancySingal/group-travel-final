import express from 'express';
import { getDashboard, getRevenueAnalytics, getGuestAnalytics } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/dashboard', adminOnly, getDashboard);
router.get('/revenue', adminOnly, getRevenueAnalytics);
router.get('/guests', adminOnly, getGuestAnalytics);

export default router;
