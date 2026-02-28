import Booking from '../models/Booking.js';
import Guest from '../models/Guest.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
export const getDashboard = asyncHandler(async (req, res) => {
  // Get booking stats
  const bookingStats = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$bookingStatus', 'Confirmed'] }, 1, 0] }
        },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ['$bookingStatus', 'Pending'] }, 1, 0] }
        },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const stats = bookingStats[0] || {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  };

  // Get top cities
  const topCities = await Booking.aggregate([
    {
      $group: {
        _id: '$city',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $project: {
        city: '$_id',
        count: 1,
        revenue: 1,
        _id: 0
      }
    }
  ]);

  // Get dietary summary
  const dietarySummary = await Guest.aggregate([
    { $unwind: '$dietaryRequirements' },
    {
      $group: {
        _id: '$dietaryRequirements',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        diet: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  // Get event type distribution
  const eventTypes = await Booking.aggregate([
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        eventType: '$_id',
        count: 1,
        revenue: 1,
        _id: 0
      }
    }
  ]);

  // Get monthly booking trend
  const monthlyTrend = await Booking.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
        revenue: 1,
        _id: 0
      }
    }
  ]);

  // Calculate average booking value
  const averageBookingValue = stats.totalBookings > 0 
    ? Math.round(stats.totalRevenue / stats.totalBookings) 
    : 0;

  res.json({
    success: true,
    data: {
      totalBookings: stats.totalBookings,
      confirmedBookings: stats.confirmedBookings,
      pendingBookings: stats.pendingBookings,
      totalRevenue: stats.totalRevenue,
      averageBookingValue,
      topCities,
      dietarySummary,
      eventTypes,
      monthlyTrend
    }
  });
});

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private (Admin)
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupBy } = req.query;

  let groupStage = {};
  
  if (groupBy === 'month') {
    groupStage = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' }
    };
  } else if (groupBy === 'day') {
    groupStage = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' }
    };
  } else if (groupBy === 'city') {
    groupStage = '$city';
  }

  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const revenueData = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupStage,
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: revenueData
  });
});

// @desc    Get guest analytics
// @route   GET /api/analytics/guests
// @access  Private (Admin)
export const getGuestAnalytics = asyncHandler(async (req, res) => {
  const { eventId, bookingId } = req.query;

  let query = {};
  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;

  const guestStats = await Guest.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalGuests: { $sum: 1 },
        confirmedGuests: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        pendingGuests: {
          $sum: { $cond: [{ $eq: ['$status', 'invited'] }, 1, 0] }
        },
        wheelchairAccessible: {
          $sum: { $cond: ['$wheelchairAccessible', 1, 0] }
        },
        mobilityAssistance: {
          $sum: { $cond: ['$mobilityAssistance', 1, 0] }
        }
      }
    }
  ]);

  const stats = guestStats[0] || {
    totalGuests: 0,
    confirmedGuests: 0,
    pendingGuests: 0,
    wheelchairAccessible: 0,
    mobilityAssistance: 0
  };

  // Get dietary breakdown
  const dietaryBreakdown = await Guest.aggregate([
    { $match: query },
    { $unwind: { path: '$dietaryRequirements', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$dietaryRequirements',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      ...stats,
      dietaryBreakdown
    }
  });
});
