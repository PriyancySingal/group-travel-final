import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  createGuest,
  getGuests,
  getGuest,
  updateGuest,
  deleteGuest,
  getDietaryAnalytics,
  getSpecialNeedsAnalytics
} from '../controllers/guestController.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all guests (Admin sees all, client sees own)
router.get('/', protect, getGuests);

// Get dietary analytics
router.get('/analytics/dietary', protect, authorize('admin'), getDietaryAnalytics);

// Get special needs analytics
router.get('/analytics/special-needs', protect, authorize('admin'), getSpecialNeedsAnalytics);

// Get single guest
router.get('/:id', protect, [
  param('id').isMongoId().withMessage('Invalid guest ID')
], validate, getGuest);

// Create guest
router.post('/', protect, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('eventId').optional().isMongoId().withMessage('Invalid event ID')
], validate, createGuest);

// Update guest
router.put('/:id', protect, [
  param('id').isMongoId().withMessage('Invalid guest ID'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], validate, updateGuest);

// Delete guest
router.delete('/:id', protect, authorize('admin'), [
  param('id').isMongoId().withMessage('Invalid guest ID')
], validate, deleteGuest);

export default router;
