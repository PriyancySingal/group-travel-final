import express from 'express';
import { calculatePricing, getPricingConfig } from '../controllers/pricingController.js';

const router = express.Router();

// Public routes
router.post('/calculate', calculatePricing);
router.get('/config', getPricingConfig);

export default router;
