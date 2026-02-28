import express from 'express';
import { 
  createBooking, 
  getBookings, 
  getBooking, 
  updateBooking, 
  deleteBooking,
  confirmMember,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Validation middleware
const bookingValidation = [
  body('hotelId').notEmpty().withMessage('Hotel ID is required'),
  body('hotelName').notEmpty().withMessage('Hotel name is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('checkInDate').notEmpty().withMessage('Check-in date is required'),
  body('checkOutDate').notEmpty().withMessage('Check-out date is required'),
  body('rooms').isNumeric().withMessage('Rooms must be a number'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
];

// Public route for creating bookings (no auth required for hackathon demo)
router.post('/', bookingValidation, asyncHandler(createBooking));

// Protected routes (require authentication)
router.route('/')
  .get(asyncHandler(getBookings));

router.route('/:id')
  .get(asyncHandler(getBooking))
  .put(asyncHandler(updateBooking))
  .delete(asyncHandler(deleteBooking));

router.patch('/:id/confirm-member', asyncHandler(confirmMember));
router.patch('/:id/cancel', asyncHandler(cancelBooking));

export default router;
