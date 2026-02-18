import Booking from '../models/Booking.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const {
    hotelId,
    hotelName,
    city,
    checkInDate,
    checkOutDate,
    rooms,
    totalAmount,
    members,
    eventType,
    eventName,
    specialRequests,
    pricingBreakdown
  } = req.body;

  const booking = await Booking.create({
    userId: req.user._id,
    hotelId,
    hotelName,
    city,
    checkInDate,
    checkOutDate,
    rooms,
    totalAmount,
    members: members.map(m => ({ ...m, status: 'Pending' })),
    eventType,
    eventName,
    specialRequests,
    pricingBreakdown,
    bookingStatus: 'Pending'
  });

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin sees all, Client sees own)
export const getBookings = asyncHandler(async (req, res) => {
  let query;

  if (req.user.role === 'admin') {
    // Admin sees all bookings
    query = Booking.find().populate('userId', 'name email company');
  } else {
    // Client sees only their bookings
    query = Booking.find({ userId: req.user._id });
  }

  const bookings = await query.sort('-createdAt');

  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('userId', 'name email phone company');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user owns the booking or is admin
  if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this booking', 403);
  }

  res.json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user owns the booking or is admin
  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this booking', 403);
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user owns the booking or is admin
  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this booking', 403);
  }

  await booking.deleteOne();

  res.json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

// @desc    Confirm a member in booking
// @route   PATCH /api/bookings/:id/confirm-member
// @access  Private
export const confirmMember = asyncHandler(async (req, res) => {
  const { memberIndex } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user owns the booking or is admin
  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this booking', 403);
  }

  if (!booking.members[memberIndex]) {
    throw new AppError('Member not found', 404);
  }

  booking.members[memberIndex].status = 'Confirmed';

  // Check if all members are confirmed
  const allConfirmed = booking.members.every(m => m.status === 'Confirmed');
  if (allConfirmed && booking.members.length > 0) {
    booking.bookingStatus = 'Confirmed';
  }

  await booking.save();

  res.json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user owns the booking or is admin
  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to cancel this booking', 403);
  }

  booking.bookingStatus = 'Cancelled';
  await booking.save();

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});
