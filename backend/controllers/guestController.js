import Guest from '../models/Guest.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

// @desc    Create new guest
// @route   POST /api/guests
// @access  Private
export const createGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.create({
    ...req.body,
    userId: req.user._id === 'demo' ? new mongoose.Types.ObjectId() : req.user._id
  });

  res.status(201).json({
    success: true,
    data: guest
  });
});

// @desc    Get all guests
// @route   GET /api/guests
// @access  Private
export const getGuests = asyncHandler(async (req, res) => {
  const { eventId, bookingId, status } = req.query;

  let query = {};

  // Filter by user if not admin
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }

  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;
  if (status) query.status = status;

  const guests = await Guest.find(query).sort('-createdAt');

  res.json({
    success: true,
    count: guests.length,
    data: guests
  });
});

// @desc    Get single guest
// @route   GET /api/guests/:id
// @access  Private
export const getGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.findById(req.params.id);

  if (!guest) {
    throw new AppError('Guest not found', 404);
  }

  // Check if user owns the guest or is admin
  if (guest.userId && guest.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this guest', 403);
  }

  res.json({
    success: true,
    data: guest
  });
});

// @desc    Update guest
// @route   PUT /api/guests/:id
// @access  Private
export const updateGuest = asyncHandler(async (req, res) => {
  let guest = await Guest.findById(req.params.id);

  if (!guest) {
    throw new AppError('Guest not found', 404);
  }

  // Check if user owns the guest or is admin
  if (guest.userId && guest.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this guest', 403);
  }

  guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: guest
  });
});

// @desc    Delete guest
// @route   DELETE /api/guests/:id
// @access  Private
export const deleteGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.findById(req.params.id);

  if (!guest) {
    throw new AppError('Guest not found', 404);
  }

  // Check if user owns the guest or is admin
  if (guest.userId && guest.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this guest', 403);
  }

  await guest.deleteOne();

  res.json({
    success: true,
    message: 'Guest deleted successfully'
  });
});

// @desc    Get dietary requirements summary
// @route   GET /api/guests/analytics/dietary
// @access  Private
export const getDietaryAnalytics = asyncHandler(async (req, res) => {
  const { eventId, bookingId } = req.query;

  let query = {};
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }
  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;

  const guests = await Guest.find(query);

  const summary = {};
  guests.forEach(guest => {
    guest.dietaryRequirements.forEach(diet => {
      summary[diet] = (summary[diet] || 0) + 1;
    });
  });

  res.json({
    success: true,
    data: summary
  });
});

// @desc    Get special needs summary
// @route   GET /api/guests/analytics/special-needs
// @access  Private
export const getSpecialNeedsAnalytics = asyncHandler(async (req, res) => {
  const { eventId, bookingId } = req.query;

  let query = {};
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }
  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;

  const guests = await Guest.find(query);

  const summary = {
    wheelchairAccessible: guests.filter(g => g.wheelchairAccessible).length,
    mobilityAssistance: guests.filter(g => g.mobilityAssistance).length,
    totalGuests: guests.length,
    withSpecialNeeds: guests.filter(g => g.specialNeeds && g.specialNeeds.length > 0).length
  };

  res.json({
    success: true,
    data: summary
  });
});

// @desc    Bulk create guests
// @route   POST /api/guests/bulk
// @access  Private
export const bulkCreateGuests = asyncHandler(async (req, res) => {
  const { guests } = req.body;

  if (!guests || !Array.isArray(guests)) {
    throw new AppError('Please provide an array of guests', 400);
  }

  const guestsWithUser = guests.map(guest => ({
    ...guest,
    userId: req.user._id
  }));

  const createdGuests = await Guest.insertMany(guestsWithUser);

  res.status(201).json({
    success: true,
    count: createdGuests.length,
    data: createdGuests
  });
});
